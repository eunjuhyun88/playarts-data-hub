import { useState } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Wand2, Save, Download, Trash2, FileJson, Play, Settings2, Sparkles, Check, X, Code, FileText, AlertCircle, Bot, Send, Loader2, Zap, Search, Lightbulb } from "lucide-react";
import { useDataSelection } from "@/contexts/DataSelectionContext";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import ReactMarkdown from 'react-markdown';

type ProcessedItem = {
  id: number;
  type: "code" | "prompt";
  title: string;
  content: string;
  lang: string;
  time: string;
  source: string;
  tokens: number;
  hash: string;
  cleanedContent?: string;
  changes?: string[];
  qualityScore?: number;
};

const DatasetStudio = () => {
  const { selectedItems, removeItem, clearSelection } = useDataSelection();
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedFormat, setSelectedFormat] = useState("jsonl");
  const [datasetName, setDatasetName] = useState("PlayArts-Finetune-v1");
  const [showAssistant, setShowAssistant] = useState(true);
  
  // AI Assistant state
  const [assistantMessages, setAssistantMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
  const [userInput, setUserInput] = useState("");
  const [isAssistantLoading, setIsAssistantLoading] = useState(false);
  
  // Batch processing state
  const [isBatchProcessing, setIsBatchProcessing] = useState(false);
  const [batchProgress, setBatchProgress] = useState(0);
  const [processedItems, setProcessedItems] = useState<ProcessedItem[]>([]);
  const [batchSummary, setBatchSummary] = useState<{ total: number; processed: number; avgQualityScore: number } | null>(null);
  
  // Preprocessing options
  const [options, setOptions] = useState({
    removeDuplicates: true,
    maskPII: true,
    codeOnly: false,
    minTokens: 50,
  });

  const callAssistant = async (action: string, userMessage?: string) => {
    if (selectedItems.length === 0 && action !== 'chat') {
      toast.error("데이터를 먼저 선택해주세요");
      return;
    }

    setIsAssistantLoading(true);

    if (userMessage) {
      setAssistantMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    }

    try {
      const { data, error } = await supabase.functions.invoke('dataset-assistant', {
        body: { 
          items: selectedItems.map(item => ({
            id: item.id,
            type: item.type,
            title: item.title,
            content: item.content,
            tokens: item.tokens
          })),
          action,
          userMessage
        }
      });

      if (error) throw error;

      if (data?.success && data?.message) {
        setAssistantMessages(prev => [...prev, { role: 'assistant', content: data.message }]);
      } else {
        throw new Error(data?.error || 'Assistant failed');
      }
    } catch (error) {
      console.error('Assistant error:', error);
      toast.error('AI Assistant error', {
        description: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsAssistantLoading(false);
    }
  };

  const handleSendMessage = () => {
    if (!userInput.trim()) return;
    callAssistant('chat', userInput);
    setUserInput("");
  };

  const runBatchAIProcessing = async () => {
    if (selectedItems.length === 0) {
      toast.error("No data to process", {
        description: "Select items from Data Lake first."
      });
      return;
    }

    setIsBatchProcessing(true);
    setBatchProgress(0);
    setProcessedItems([]);
    setBatchSummary(null);

    // Simulate progress while waiting for AI
    const progressInterval = setInterval(() => {
      setBatchProgress(prev => Math.min(prev + 2, 90));
    }, 200);

    try {
      const { data, error } = await supabase.functions.invoke('batch-process', {
        body: { 
          items: selectedItems.map(item => ({
            id: item.id,
            type: item.type,
            title: item.title,
            content: item.content,
            lang: item.lang,
            time: item.time,
            source: item.source,
            tokens: item.tokens,
            hash: item.hash
          })),
          options
        }
      });

      clearInterval(progressInterval);
      setBatchProgress(100);

      if (error) throw error;

      if (data?.success) {
        setProcessedItems(data.items);
        setBatchSummary(data.summary);
        toast.success("Batch AI processing complete!", {
          description: `${data.summary.processed} items cleaned. Avg quality: ${data.summary.avgQualityScore}%`
        });
      } else {
        throw new Error(data?.error || 'Batch processing failed');
      }
    } catch (error) {
      clearInterval(progressInterval);
      console.error('Batch process error:', error);
      toast.error('Batch processing failed', {
        description: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsBatchProcessing(false);
    }
  };

  const runProcessing = () => {
    if (selectedItems.length === 0) {
      toast.error("No data to process", {
        description: "Select items from Data Lake first."
      });
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    let p = 0;
    const interval = setInterval(() => {
      p += 5;
      setProgress(p);
      if (p >= 100) {
        clearInterval(interval);
        setIsProcessing(false);
        toast.success("Dataset processing complete!", {
          description: `${selectedItems.length} items converted to ${selectedFormat.toUpperCase()} format.`
        });
      }
    }, 100);
  };

  const handleExport = () => {
    if (selectedItems.length === 0) {
      toast.error("No data to export");
      return;
    }

    // Use processed items if available, otherwise use selected items
    const itemsToExport = processedItems.length > 0 ? processedItems : selectedItems;
    const exportData = itemsToExport.map((item, i) => ({
      id: `train_${i}`,
      messages: [
        { role: "user", content: item.title },
        { role: "assistant", content: 'cleanedContent' in item && item.cleanedContent ? item.cleanedContent : item.content }
      ]
    }));

    const blob = new Blob([exportData.map(d => JSON.stringify(d)).join('\n')], { type: 'application/jsonl' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${datasetName}.${selectedFormat === 'jsonl' ? 'jsonl' : 'json'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success("Dataset exported", {
      description: `${datasetName}.${selectedFormat === 'jsonl' ? 'jsonl' : 'json'}`
    });
  };

  const totalTokens = selectedItems.reduce((sum, item) => sum + item.tokens, 0);

  return (
    <div className="h-[calc(100vh-8rem)] w-full rounded-xl border border-border/50 bg-background/50 backdrop-blur-sm overflow-hidden flex flex-col animate-fade-in">
      {/* Toolbar */}
      <div className="h-14 border-b border-border/50 flex items-center justify-between px-4 bg-card/50">
        <div className="flex items-center gap-4">
          <Input 
            className="w-64 h-9 font-space bg-background/80 border-primary/30 focus-visible:ring-primary/50 focus-visible:border-primary" 
            placeholder="Dataset Name" 
            value={datasetName}
            onChange={(e) => setDatasetName(e.target.value)}
          />
          <Badge variant="outline" className="border-primary/50 text-primary bg-primary/10 font-mono">
            <Sparkles className="w-3 h-3 mr-1" />
            {selectedItems.length} Items
          </Badge>
          <Badge variant="outline" className="border-muted-foreground/50 text-muted-foreground font-mono">
            {totalTokens.toLocaleString()} Tokens
          </Badge>
          {batchSummary && (
            <Badge variant="outline" className="border-accent/50 text-accent bg-accent/10 font-mono">
              <Check className="w-3 h-3 mr-1" />
              AI Cleaned ({batchSummary.avgQualityScore}% quality)
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowAssistant(!showAssistant)}
            className={showAssistant ? 'border-accent text-accent' : ''}
          >
            <Bot className="w-4 h-4 mr-2" />
            AI Assistant
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-muted-foreground hover:text-destructive"
            onClick={clearSelection}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear All
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            className="border-accent/50 text-accent hover:bg-accent/10" 
            onClick={runBatchAIProcessing} 
            disabled={isBatchProcessing || selectedItems.length === 0}
          >
            {isBatchProcessing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Zap className="w-4 h-4 mr-2" />}
            {isBatchProcessing ? "AI Cleaning..." : "AI Clean All"}
          </Button>
          <Button 
            size="sm" 
            className="bg-primary text-primary-foreground font-bold shadow-neon-sm hover:shadow-neon transition-shadow" 
            onClick={runProcessing} 
            disabled={isProcessing || selectedItems.length === 0}
          >
            {isProcessing ? <Wand2 className="w-4 h-4 mr-2 animate-spin" /> : <Play className="w-4 h-4 mr-2" />}
            {isProcessing ? "Processing..." : "Run Pipeline"}
          </Button>
        </div>
      </div>

      <ResizablePanelGroup direction="horizontal" className="flex-1">
        
        {/* Left Panel: Selected Items & Configuration */}
        <ResizablePanel defaultSize={28} minSize={22} maxSize={40} className="bg-secondary/20">
          <ScrollArea className="h-full">
            <div className="p-4 space-y-4">
              {/* Selected Items List */}
              <div>
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2 font-space">
                  <Sparkles className="w-4 h-4 text-primary" />
                  Selected Data ({selectedItems.length})
                </h3>
                
                {selectedItems.length === 0 ? (
                  <div className="p-6 rounded-lg border border-dashed border-border/50 bg-card/30 text-center">
                    <AlertCircle className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">No data selected</p>
                    <p className="text-xs text-muted-foreground/70 mt-1">Select items from Data Lake</p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[180px] overflow-auto custom-scrollbar">
                    {selectedItems.map((item) => (
                      <div 
                        key={item.id} 
                        className="group flex items-center gap-3 p-2 rounded-lg bg-card/50 border border-border/30 hover:border-primary/30 transition-colors"
                      >
                        <div className={`p-1.5 rounded ${item.type === 'code' ? 'bg-primary/10 text-primary' : 'bg-accent/10 text-accent'}`}>
                          {item.type === 'code' ? <Code className="w-3 h-3" /> : <FileText className="w-3 h-3" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium truncate">{item.title}</p>
                          <p className="text-[10px] text-muted-foreground font-mono">{item.tokens} tokens</p>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10 hover:text-destructive"
                          onClick={() => removeItem(item.id)}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Separator className="bg-border/50" />

              {/* Preprocessing Rules */}
              <div>
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2 font-space">
                  <Settings2 className="w-4 h-4 text-primary" />
                  Preprocessing
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-card/50 border border-border/30">
                    <Label htmlFor="dedup" className="text-xs cursor-pointer">Remove Duplicates</Label>
                    <Switch 
                      id="dedup" 
                      checked={options.removeDuplicates}
                      onCheckedChange={(checked) => setOptions(prev => ({ ...prev, removeDuplicates: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-card/50 border border-border/30">
                    <Label htmlFor="pii" className="text-xs cursor-pointer">Mask PII Data</Label>
                    <Switch 
                      id="pii" 
                      checked={options.maskPII}
                      onCheckedChange={(checked) => setOptions(prev => ({ ...prev, maskPII: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-card/50 border border-border/30">
                    <Label htmlFor="code-only" className="text-xs cursor-pointer">Code Only</Label>
                    <Switch 
                      id="code-only" 
                      checked={options.codeOnly}
                      onCheckedChange={(checked) => setOptions(prev => ({ ...prev, codeOnly: checked }))}
                    />
                  </div>
                </div>
              </div>
              
              <Separator className="bg-border/50" />

              {/* Output Format */}
              <div>
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2 font-space">
                  <FileJson className="w-4 h-4 text-primary" />
                  Output Format
                </h3>
                <div className="space-y-2">
                  {[
                    { id: "jsonl", name: "JSONL (Chat)", desc: "OpenAI / Claude" },
                    { id: "alpaca", name: "Alpaca", desc: "Instruct format" },
                    { id: "sharegpt", name: "ShareGPT", desc: "Multi-turn" },
                  ].map((format) => (
                    <div 
                      key={format.id}
                      onClick={() => setSelectedFormat(format.id)}
                      className={`p-2 rounded-lg border cursor-pointer transition-all ${
                        selectedFormat === format.id 
                          ? "border-primary/60 bg-primary/10 shadow-neon-sm" 
                          : "border-border/50 bg-card/30 hover:border-primary/30"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="font-bold text-xs font-space">{format.name}</div>
                        {selectedFormat === format.id && <Check className="w-3 h-3 text-primary" />}
                      </div>
                      <div className="text-[10px] text-muted-foreground">{format.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ScrollArea>
        </ResizablePanel>

        <ResizableHandle withHandle className="bg-border/30 hover:bg-primary/30 transition-colors" />

        {/* Middle Panel: Preview */}
        <ResizablePanel defaultSize={showAssistant ? 42 : 72}>
          <div className="h-full flex flex-col p-4">
            {isProcessing && (
              <div className="mb-4 space-y-2 animate-fade-in">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground font-space">Processing {selectedItems.length} items...</span>
                  <span className="text-primary font-mono font-bold">{progress}%</span>
                </div>
                <Progress value={progress} className="h-2 bg-secondary" />
              </div>
            )}

            {isBatchProcessing && (
              <div className="mb-4 space-y-2 animate-fade-in">
                <div className="flex justify-between text-xs">
                  <span className="text-accent font-space">AI cleaning {selectedItems.length} items...</span>
                  <span className="text-accent font-mono font-bold">{batchProgress}%</span>
                </div>
                <Progress value={batchProgress} className="h-2 bg-accent/20" />
              </div>
            )}

            <div className="flex-1 bg-background/80 rounded-xl border border-border/50 p-4 font-mono text-xs overflow-auto custom-scrollbar">
              <div className="text-muted-foreground mb-4 flex items-center gap-2">
                <span className="text-primary">//</span> Dataset Preview
                <Badge variant="outline" className="ml-auto text-[10px] font-mono">
                  {selectedFormat.toUpperCase()}
                </Badge>
                {processedItems.length > 0 && (
                  <Badge variant="outline" className="text-[10px] font-mono border-accent/50 text-accent bg-accent/10">
                    AI Processed
                  </Badge>
                )}
              </div>
              
              {selectedItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[200px] text-muted-foreground">
                  <FileJson className="w-12 h-12 mb-4 opacity-30" />
                  <p className="text-sm">No data to preview</p>
                </div>
              ) : processedItems.length > 0 ? (
                // Show processed items with AI quality info
                processedItems.slice(0, 5).map((item, i) => (
                  <div key={item.id} className="mb-3 p-3 rounded-lg bg-card/60 border border-accent/30 text-[11px]">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-accent text-[10px] flex items-center gap-1">
                        <Check className="w-3 h-3" /> AI Cleaned
                      </span>
                      <Badge variant="outline" className="text-[9px] border-accent/50 text-accent">
                        Quality: {item.qualityScore}%
                      </Badge>
                    </div>
                    <span className="text-primary">{`{`}</span>
                    <div className="pl-3">
                      <span className="text-neon-orange">"id"</span>: <span className="text-neon-green">"train_{i}"</span>,
                      <br />
                      <span className="text-neon-orange">"messages"</span>: [
                      <span className="text-primary">{`{`}</span>"role": "user", "content": "{item.title}"<span className="text-primary">{`}`}</span>,
                      <span className="text-primary">{`{`}</span>"role": "assistant", "content": "..."<span className="text-primary">{`}`}</span>]
                    </div>
                    <span className="text-primary">{`}`}</span>
                    {item.changes && item.changes.length > 0 && (
                      <div className="mt-2 text-[9px] text-muted-foreground">
                        Changes: {item.changes.slice(0, 2).join(', ')}
                        {item.changes.length > 2 && ` +${item.changes.length - 2} more`}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                selectedItems.slice(0, 5).map((item, i) => (
                  <div key={item.id} className="mb-3 p-3 rounded-lg bg-card/60 border border-border/30 text-[11px]">
                    <span className="text-primary">{`{`}</span>
                    <div className="pl-3">
                      <span className="text-neon-orange">"id"</span>: <span className="text-neon-green">"train_{i}"</span>,
                      <br />
                      <span className="text-neon-orange">"messages"</span>: [
                      <span className="text-primary">{`{`}</span>"role": "user", "content": "{item.title}"<span className="text-primary">{`}`}</span>,
                      <span className="text-primary">{`{`}</span>"role": "assistant", "content": "..."<span className="text-primary">{`}`}</span>]
                    </div>
                    <span className="text-primary">{`}`}</span>
                  </div>
                ))
              )}
              {selectedItems.length > 5 && (
                <div className="text-center text-muted-foreground py-2">
                  ... and {selectedItems.length - 5} more items
                </div>
              )}
            </div>

            <div className="mt-4 flex justify-between items-center">
              <div className="text-xs text-muted-foreground">
                {selectedItems.length > 0 && (
                  <>Est: <span className="font-mono">{(totalTokens * 0.004).toFixed(1)} KB</span></>
                )}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled={selectedItems.length === 0}>
                  <Save className="w-4 h-4 mr-1" />
                  Save
                </Button>
                <Button size="sm" disabled={selectedItems.length === 0} onClick={handleExport}>
                  <Download className="w-4 h-4 mr-1" />
                  Export
                </Button>
              </div>
            </div>
          </div>
        </ResizablePanel>

        {/* Right Panel: AI Assistant */}
        {showAssistant && (
          <>
            <ResizableHandle withHandle className="bg-border/30 hover:bg-accent/30 transition-colors" />
            <ResizablePanel defaultSize={30} minSize={25} maxSize={40}>
              <div className="h-full flex flex-col bg-accent/5 border-l border-accent/20">
                <div className="p-3 border-b border-accent/20 bg-accent/10">
                  <div className="flex items-center gap-2">
                    <Bot className="w-5 h-5 text-accent" />
                    <h3 className="font-space font-semibold text-sm">AI Assistant</h3>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1">Optimize your training data</p>
                </div>

                {/* Quick Actions */}
                <div className="p-2 border-b border-accent/20 flex gap-2 flex-wrap">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="text-[10px] h-7 border-accent/30 hover:bg-accent/10"
                    onClick={() => callAssistant('analyze')}
                    disabled={isAssistantLoading || selectedItems.length === 0}
                  >
                    <Search className="w-3 h-3 mr-1" />
                    Analyze
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="text-[10px] h-7 border-accent/30 hover:bg-accent/10"
                    onClick={() => callAssistant('suggest-improvements')}
                    disabled={isAssistantLoading || selectedItems.length === 0}
                  >
                    <Lightbulb className="w-3 h-3 mr-1" />
                    Improve
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="text-[10px] h-7 border-accent/30 hover:bg-accent/10"
                    onClick={() => callAssistant('generate-pairs')}
                    disabled={isAssistantLoading || selectedItems.length === 0}
                  >
                    <Zap className="w-3 h-3 mr-1" />
                    Generate
                  </Button>
                </div>

                {/* Chat Messages */}
                <ScrollArea className="flex-1 p-3">
                  <div className="space-y-3">
                    {assistantMessages.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        <Bot className="w-10 h-10 mx-auto mb-3 opacity-30" />
                        <p className="text-xs">Ask me anything about your dataset!</p>
                        <p className="text-[10px] mt-1 opacity-70">Use quick actions or type below</p>
                      </div>
                    )}
                    {assistantMessages.map((msg, idx) => (
                      <div 
                        key={idx} 
                        className={`p-3 rounded-lg text-xs ${
                          msg.role === 'user' 
                            ? 'bg-primary/10 border border-primary/20 ml-4' 
                            : 'bg-accent/10 border border-accent/20 mr-4'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          {msg.role === 'assistant' ? (
                            <Bot className="w-3 h-3 text-accent" />
                          ) : (
                            <div className="w-3 h-3 rounded-full bg-primary" />
                          )}
                          <span className="font-semibold text-[10px]">
                            {msg.role === 'assistant' ? 'Assistant' : 'You'}
                          </span>
                        </div>
                        <div className="prose prose-xs prose-invert max-w-none">
                          <ReactMarkdown>{msg.content}</ReactMarkdown>
                        </div>
                      </div>
                    ))}
                    {isAssistantLoading && (
                      <div className="flex items-center gap-2 p-3 bg-accent/10 rounded-lg mr-4">
                        <Loader2 className="w-4 h-4 animate-spin text-accent" />
                        <span className="text-xs text-muted-foreground">Thinking...</span>
                      </div>
                    )}
                  </div>
                </ScrollArea>

                {/* Chat Input */}
                <div className="p-3 border-t border-accent/20">
                  <div className="flex gap-2">
                    <Textarea 
                      placeholder="Ask about your dataset..."
                      className="min-h-[60px] text-xs bg-background/50 border-accent/30 focus-visible:ring-accent/50 resize-none"
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    />
                    <Button 
                      size="icon" 
                      className="h-[60px] w-10 bg-accent hover:bg-accent/90"
                      onClick={handleSendMessage}
                      disabled={isAssistantLoading || !userInput.trim()}
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </ResizablePanel>
          </>
        )}
      </ResizablePanelGroup>
    </div>
  );
};

export default DatasetStudio;
