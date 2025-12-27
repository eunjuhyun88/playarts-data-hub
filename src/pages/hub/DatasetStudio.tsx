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
import { Wand2, Save, Download, Trash2, FileJson, Play, Settings2, Sparkles, Check, X, Code, FileText, AlertCircle } from "lucide-react";
import { useDataSelection } from "@/contexts/DataSelectionContext";
import { toast } from "sonner";

const DatasetStudio = () => {
  const { selectedItems, removeItem, clearSelection } = useDataSelection();
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedFormat, setSelectedFormat] = useState("jsonl");
  const [datasetName, setDatasetName] = useState("PlayArts-Finetune-v1");
  
  // Preprocessing options
  const [options, setOptions] = useState({
    removeDuplicates: true,
    maskPII: true,
    codeOnly: false,
    minTokens: 50,
  });

  const runProcessing = () => {
    if (selectedItems.length === 0) {
      toast.error("처리할 데이터가 없습니다", {
        description: "Data Lake에서 데이터를 선택해주세요."
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
        toast.success("데이터셋 처리 완료!", {
          description: `${selectedItems.length}개 항목이 ${selectedFormat.toUpperCase()} 형식으로 변환되었습니다.`
        });
      }
    }, 100);
  };

  const handleExport = () => {
    if (selectedItems.length === 0) {
      toast.error("내보낼 데이터가 없습니다");
      return;
    }
    toast.success("데이터셋 내보내기 시작", {
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
        </div>
        <div className="flex items-center gap-2">
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
        <ResizablePanel defaultSize={32} minSize={25} maxSize={45} className="bg-secondary/20">
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
                  <div className="space-y-2 max-h-[200px] overflow-auto custom-scrollbar">
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
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-card/50 border border-border/30">
                    <Label htmlFor="dedup" className="text-xs cursor-pointer">Remove Duplicates</Label>
                    <Switch 
                      id="dedup" 
                      checked={options.removeDuplicates}
                      onCheckedChange={(checked) => setOptions(prev => ({ ...prev, removeDuplicates: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-card/50 border border-border/30">
                    <Label htmlFor="pii" className="text-xs cursor-pointer">Mask PII Data</Label>
                    <Switch 
                      id="pii" 
                      checked={options.maskPII}
                      onCheckedChange={(checked) => setOptions(prev => ({ ...prev, maskPII: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-card/50 border border-border/30">
                    <Label htmlFor="code-only" className="text-xs cursor-pointer">Code Only</Label>
                    <Switch 
                      id="code-only" 
                      checked={options.codeOnly}
                      onCheckedChange={(checked) => setOptions(prev => ({ ...prev, codeOnly: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-card/50 border border-border/30">
                    <Label htmlFor="min-tokens" className="text-xs cursor-pointer">Min Tokens</Label>
                    <Input 
                      id="min-tokens" 
                      type="number" 
                      value={options.minTokens}
                      onChange={(e) => setOptions(prev => ({ ...prev, minTokens: parseInt(e.target.value) || 0 }))}
                      className="w-20 h-7 text-xs text-center bg-background/50"
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
                    { id: "jsonl", name: "JSONL (Chat)", desc: "OpenAI / Claude Compatible" },
                    { id: "alpaca", name: "Alpaca Instruct", desc: "instruction / input / output" },
                    { id: "sharegpt", name: "ShareGPT", desc: "Multi-turn conversations" },
                  ].map((format) => (
                    <div 
                      key={format.id}
                      onClick={() => setSelectedFormat(format.id)}
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        selectedFormat === format.id 
                          ? "border-primary/60 bg-primary/10 shadow-neon-sm" 
                          : "border-border/50 bg-card/30 hover:border-primary/30"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="font-bold text-xs font-space">{format.name}</div>
                        {selectedFormat === format.id && <Check className="w-4 h-4 text-primary" />}
                      </div>
                      <div className="text-[10px] text-muted-foreground mt-0.5">{format.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ScrollArea>
        </ResizablePanel>

        <ResizableHandle withHandle className="bg-border/30 hover:bg-primary/30 transition-colors" />

        {/* Right Panel: Preview & Results */}
        <ResizablePanel defaultSize={68}>
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

            <div className="flex-1 bg-background/80 rounded-xl border border-border/50 p-4 font-mono text-xs overflow-auto custom-scrollbar">
              <div className="text-muted-foreground mb-4 flex items-center gap-2">
                <span className="text-primary">//</span> Dataset Preview Output
                <Badge variant="outline" className="ml-auto text-[10px] font-mono">
                  {selectedFormat.toUpperCase()}
                </Badge>
              </div>
              
              {selectedItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground">
                  <FileJson className="w-12 h-12 mb-4 opacity-30" />
                  <p className="text-sm">No data to preview</p>
                  <p className="text-xs mt-1 opacity-70">Select items from Data Lake to see preview</p>
                </div>
              ) : (
                selectedItems.map((item, i) => (
                  <div key={item.id} className="mb-4 p-4 rounded-lg bg-card/60 border border-border/30 hover:border-primary/30 transition-colors">
                    <span className="text-primary">{`{`}</span>
                    <div className="pl-4 space-y-1">
                      <div>
                        <span className="text-neon-orange">"id"</span>
                        <span className="text-muted-foreground">: </span>
                        <span className="text-neon-green">"train_{i}"</span>
                        <span className="text-muted-foreground">,</span>
                      </div>
                      <div>
                        <span className="text-neon-orange">"messages"</span>
                        <span className="text-muted-foreground">: [</span>
                      </div>
                      <div className="pl-4 space-y-1">
                        <div>
                          <span className="text-primary">{`{`}</span>
                          <span className="text-neon-orange">"role"</span>
                          <span className="text-muted-foreground">: </span>
                          <span className="text-neon-green">"user"</span>
                          <span className="text-muted-foreground">, </span>
                          <span className="text-neon-orange">"content"</span>
                          <span className="text-muted-foreground">: </span>
                          <span className="text-neon-green">"{item.title}"</span>
                          <span className="text-primary">{`}`}</span>
                          <span className="text-muted-foreground">,</span>
                        </div>
                        <div>
                          <span className="text-primary">{`{`}</span>
                          <span className="text-neon-orange">"role"</span>
                          <span className="text-muted-foreground">: </span>
                          <span className="text-neon-green">"assistant"</span>
                          <span className="text-muted-foreground">, </span>
                          <span className="text-neon-orange">"content"</span>
                          <span className="text-muted-foreground">: </span>
                          <span className="text-neon-green">"{item.content.slice(0, 80)}..."</span>
                          <span className="text-primary">{`}`}</span>
                        </div>
                      </div>
                      <div><span className="text-muted-foreground">]</span></div>
                    </div>
                    <span className="text-primary">{`}`}</span>
                  </div>
                ))
              )}
            </div>

            <div className="mt-4 flex justify-between items-center">
              <div className="text-xs text-muted-foreground">
                {selectedItems.length > 0 && (
                  <>
                    Estimated: <span className="text-foreground font-mono">{(totalTokens * 0.004).toFixed(1)} KB</span> • 
                    <span className="text-foreground font-mono ml-1">{selectedItems.length} samples</span>
                  </>
                )}
              </div>
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  className="border-border/50 hover:border-primary/50"
                  disabled={selectedItems.length === 0}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Draft
                </Button>
                <Button 
                  className="bg-primary/90 hover:bg-primary shadow-neon-sm hover:shadow-neon transition-shadow"
                  disabled={selectedItems.length === 0}
                  onClick={handleExport}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export Dataset
                </Button>
              </div>
            </div>
          </div>
        </ResizablePanel>

      </ResizablePanelGroup>
    </div>
  );
};

export default DatasetStudio;
