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
import { Wand2, Save, Download, Trash2, FileJson, Play, Settings2, Sparkles, Check } from "lucide-react";

const DatasetStudio = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedFormat, setSelectedFormat] = useState("jsonl");

  const runProcessing = () => {
    setIsProcessing(true);
    setProgress(0);
    let p = 0;
    const interval = setInterval(() => {
      p += 5;
      setProgress(p);
      if (p >= 100) {
        clearInterval(interval);
        setIsProcessing(false);
      }
    }, 100);
  };

  const previewData = [
    { id: "train_0", user: "Explain quantum entanglement", assistant: "Quantum entanglement is a physical phenomenon where two particles become interconnected..." },
    { id: "train_1", user: "Write a Python function for sorting", assistant: "def quicksort(arr): if len(arr) <= 1: return arr; pivot = arr[len(arr) // 2]..." },
    { id: "train_2", user: "What is machine learning?", assistant: "Machine learning is a subset of artificial intelligence that enables computers to learn..." },
    { id: "train_3", user: "Explain REST API design principles", assistant: "REST (Representational State Transfer) APIs follow six key architectural constraints..." },
    { id: "train_4", user: "How does blockchain work?", assistant: "Blockchain is a distributed ledger technology that records transactions across multiple..." },
  ];

  return (
    <div className="h-[calc(100vh-8rem)] w-full rounded-xl border border-border/50 bg-background/50 backdrop-blur-sm overflow-hidden flex flex-col animate-fade-in">
      {/* Toolbar */}
      <div className="h-14 border-b border-border/50 flex items-center justify-between px-4 bg-card/50">
        <div className="flex items-center gap-4">
          <Input 
            className="w-64 h-9 font-space bg-background/80 border-primary/30 focus-visible:ring-primary/50 focus-visible:border-primary" 
            placeholder="Dataset Name (e.g. Code-Instruct-v1)" 
            defaultValue="PlayArts-Finetune-v1"
          />
          <Badge variant="outline" className="border-primary/50 text-primary bg-primary/10 font-mono">
            <Sparkles className="w-3 h-3 mr-1" />
            142 Items
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive">
            <Trash2 className="w-4 h-4 mr-2" />
            Clear
          </Button>
          <Button 
            size="sm" 
            className="bg-primary text-primary-foreground font-bold shadow-neon-sm hover:shadow-neon transition-shadow" 
            onClick={runProcessing} 
            disabled={isProcessing}
          >
            {isProcessing ? <Wand2 className="w-4 h-4 mr-2 animate-spin" /> : <Play className="w-4 h-4 mr-2" />}
            {isProcessing ? "Processing..." : "Run Pipeline"}
          </Button>
        </div>
      </div>

      <ResizablePanelGroup direction="horizontal" className="flex-1">
        
        {/* Left Panel: Configuration */}
        <ResizablePanel defaultSize={28} minSize={22} maxSize={40} className="bg-secondary/20">
          <ScrollArea className="h-full">
            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-sm font-semibold mb-4 flex items-center gap-2 font-space">
                  <Settings2 className="w-4 h-4 text-primary" />
                  Preprocessing Rules
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-card/50 border border-border/30">
                    <Label htmlFor="dedup" className="text-sm cursor-pointer">Remove Duplicates</Label>
                    <Switch id="dedup" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-card/50 border border-border/30">
                    <Label htmlFor="pii" className="text-sm cursor-pointer">Mask PII Data</Label>
                    <Switch id="pii" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-card/50 border border-border/30">
                    <Label htmlFor="code-only" className="text-sm cursor-pointer">Filter Code Only</Label>
                    <Switch id="code-only" />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-card/50 border border-border/30">
                    <Label htmlFor="min-tokens" className="text-sm cursor-pointer">Min Token Length</Label>
                    <Input 
                      id="min-tokens" 
                      type="number" 
                      defaultValue="50" 
                      className="w-20 h-7 text-xs text-center bg-background/50"
                    />
                  </div>
                </div>
              </div>
              
              <Separator className="bg-border/50" />

              <div>
                <h3 className="text-sm font-semibold mb-4 flex items-center gap-2 font-space">
                  <FileJson className="w-4 h-4 text-primary" />
                  Output Format
                </h3>
                <div className="space-y-3">
                  <div 
                    onClick={() => setSelectedFormat("jsonl")}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      selectedFormat === "jsonl" 
                        ? "border-primary/60 bg-primary/10 shadow-neon-sm" 
                        : "border-border/50 bg-card/30 hover:border-primary/30"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-xs text-primary font-space">JSONL (Chat)</div>
                      {selectedFormat === "jsonl" && <Check className="w-4 h-4 text-primary" />}
                    </div>
                    <div className="text-[11px] text-muted-foreground mt-1">OpenAI / Claude Compatible</div>
                  </div>
                  <div 
                    onClick={() => setSelectedFormat("alpaca")}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      selectedFormat === "alpaca" 
                        ? "border-primary/60 bg-primary/10 shadow-neon-sm" 
                        : "border-border/50 bg-card/30 hover:border-primary/30"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-xs font-space">Alpaca Instruct</div>
                      {selectedFormat === "alpaca" && <Check className="w-4 h-4 text-primary" />}
                    </div>
                    <div className="text-[11px] text-muted-foreground mt-1">instruction / input / output</div>
                  </div>
                  <div 
                    onClick={() => setSelectedFormat("sharegpt")}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      selectedFormat === "sharegpt" 
                        ? "border-primary/60 bg-primary/10 shadow-neon-sm" 
                        : "border-border/50 bg-card/30 hover:border-primary/30"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-xs font-space">ShareGPT</div>
                      {selectedFormat === "sharegpt" && <Check className="w-4 h-4 text-primary" />}
                    </div>
                    <div className="text-[11px] text-muted-foreground mt-1">Multi-turn conversations</div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>
        </ResizablePanel>

        <ResizableHandle withHandle className="bg-border/30 hover:bg-primary/30 transition-colors" />

        {/* Right Panel: Preview & Results */}
        <ResizablePanel defaultSize={72}>
          <div className="h-full flex flex-col p-6">
            {isProcessing && (
              <div className="mb-6 space-y-2 animate-fade-in">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground font-space">Processing items...</span>
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
              
              {previewData.map((item, i) => (
                <div key={i} className="mb-4 p-4 rounded-lg bg-card/60 border border-border/30 hover:border-primary/30 transition-colors">
                  <span className="text-primary">{`{`}</span>
                  <div className="pl-4 space-y-1">
                    <div>
                      <span className="text-neon-orange">"id"</span>
                      <span className="text-muted-foreground">: </span>
                      <span className="text-neon-green">"{item.id}"</span>
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
                        <span className="text-neon-green">"{item.user}"</span>
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
                        <span className="text-neon-green">"{item.assistant}"</span>
                        <span className="text-primary">{`}`}</span>
                      </div>
                    </div>
                    <div><span className="text-muted-foreground">]</span></div>
                  </div>
                  <span className="text-primary">{`}`}</span>
                </div>
              ))}
            </div>

            <div className="mt-4 flex justify-between items-center">
              <div className="text-xs text-muted-foreground">
                Estimated output: <span className="text-foreground font-mono">2.4 MB</span> • <span className="text-foreground font-mono">142 samples</span>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="border-border/50 hover:border-primary/50">
                  <Save className="w-4 h-4 mr-2" />
                  Save Draft
                </Button>
                <Button className="bg-primary/90 hover:bg-primary shadow-neon-sm hover:shadow-neon transition-shadow">
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
