import { useState } from "react";
import { 
  Command, 
  CommandInput, 
  CommandList, 
  CommandEmpty, 
} from "@/components/ui/command";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Checkbox } from "@/components/ui/checkbox";
import { AreaChart, Area } from 'recharts';
import { ChartContainer } from "@/components/ui/chart";
import { Code, FileText, Plus, TrendingUp, HardDrive, Layers, Check, ArrowRight, Trash2 } from "lucide-react";
import { useDataSelection, DataItem } from "@/contexts/DataSelectionContext";
import { toast } from "sonner";

const chartData = [
  { name: 'Mon', code: 400, text: 240, image: 240 },
  { name: 'Tue', code: 300, text: 139, image: 221 },
  { name: 'Wed', code: 200, text: 980, image: 229 },
  { name: 'Thu', code: 278, text: 390, image: 200 },
  { name: 'Fri', code: 189, text: 480, image: 218 },
  { name: 'Sat', code: 239, text: 380, image: 250 },
  { name: 'Sun', code: 349, text: 430, image: 210 },
];

const chartConfig = {
  code: { label: "Code", color: "hsl(var(--primary))" },
  text: { label: "Text", color: "hsl(var(--accent))" },
  image: { label: "Image", color: "hsl(var(--neon-pink))" },
};

const mockDataItems: DataItem[] = [
  { id: 1, type: "code", title: "React Hook Authentication", content: "const useAuth = () => { const [user, setUser] = useState(null); useEffect(() => { const session = supabase.auth.getSession(); setUser(session?.user); }, []); return { user, signIn, signOut }; }", lang: "TYPESCRIPT", time: "2 mins ago", source: "Claude 3.5 Sonnet", tokens: 1240, hash: "0x7f3a8b2c" },
  { id: 2, type: "prompt", title: "Cyberpunk City Prompt", content: "A futuristic city with neon lights, rain pouring down, reflecting on the wet pavement. Flying cars zoom between towering skyscrapers covered in holographic advertisements.", lang: "PROMPT", time: "5 mins ago", source: "Midjourney v6", tokens: 892, hash: "0x9d2e4f1a" },
  { id: 3, type: "code", title: "Python Data Pipeline", content: "def process_data(df): return df.dropna().reset_index(drop=True).apply(lambda x: x.strip() if isinstance(x, str) else x)", lang: "PYTHON", time: "12 mins ago", source: "GPT-4o", tokens: 567, hash: "0x3c8b7d4e" },
  { id: 4, type: "prompt", title: "API Documentation Gen", content: "Generate comprehensive API documentation for a REST endpoint that handles user authentication with JWT tokens, including request/response schemas.", lang: "PROMPT", time: "18 mins ago", source: "Claude 3.5 Sonnet", tokens: 1456, hash: "0x5a1f9c3b" },
  { id: 5, type: "code", title: "SQL Query Optimization", content: "SELECT u.id, u.name, COUNT(o.id) as order_count FROM users u LEFT JOIN orders o ON u.id = o.user_id GROUP BY u.id HAVING COUNT(o.id) > 5 ORDER BY order_count DESC", lang: "SQL", time: "25 mins ago", source: "GPT-4o", tokens: 423, hash: "0x2b7c6e8d" },
  { id: 6, type: "prompt", title: "Machine Learning Explanation", content: "Explain the concept of gradient descent in machine learning, focusing on how it optimizes neural network weights through backpropagation.", lang: "PROMPT", time: "32 mins ago", source: "Claude 3 Opus", tokens: 2103, hash: "0x8f4a2d1c" },
  { id: 7, type: "code", title: "Docker Compose Config", content: "version: '3.8'\nservices:\n  app:\n    build: .\n    ports:\n      - '3000:3000'\n    environment:\n      - NODE_ENV=production\n    depends_on:\n      - db", lang: "YAML", time: "45 mins ago", source: "GPT-4o", tokens: 678, hash: "0x1e5d9a7f" },
  { id: 8, type: "prompt", title: "Code Review Guidelines", content: "Review this code for potential performance issues, security vulnerabilities, and best practices. Focus on memory leaks and SQL injection risks.", lang: "PROMPT", time: "1 hour ago", source: "Claude 3.5 Sonnet", tokens: 934, hash: "0x6c3b8e2a" },
];

type DataExplorerProps = {
  onNavigateToStudio: () => void;
};

const DataExplorer = ({ onNavigateToStudio }: DataExplorerProps) => {
  const { selectedItems, isSelected, toggleSelection, clearSelection } = useDataSelection();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredItems = mockDataItems.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.lang.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleProceedToStudio = () => {
    if (selectedItems.length === 0) {
      toast.error("선택된 데이터가 없습니다", {
        description: "최소 1개 이상의 데이터를 선택해주세요."
      });
      return;
    }
    toast.success(`${selectedItems.length}개 항목이 Studio로 전송됩니다`);
    onNavigateToStudio();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Selection Bar - Shows when items are selected */}
      {selectedItems.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-slide-in">
          <div className="flex items-center gap-4 px-6 py-3 rounded-full bg-primary/95 text-primary-foreground shadow-neon backdrop-blur-sm border border-primary/50">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary-foreground/20 flex items-center justify-center font-bold font-mono">
                {selectedItems.length}
              </div>
              <span className="font-space font-medium">items selected</span>
            </div>
            <div className="w-px h-6 bg-primary-foreground/30" />
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearSelection}
              className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Clear
            </Button>
            <Button 
              size="sm" 
              onClick={handleProceedToStudio}
              className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-bold"
            >
              Process in Studio
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      )}

      {/* Top Stats Area */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="glass-panel border-primary/30 shadow-neon-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Captured</CardTitle>
              <TrendingUp className="w-4 h-4 text-neon-green" />
            </div>
            <CardDescription className="text-3xl font-bold font-space text-primary text-shadow-neon">
              12,842
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-neon-green flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              +12% from last week
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-panel">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">Storage Used</CardTitle>
              <HardDrive className="w-4 h-4 text-muted-foreground" />
            </div>
            <CardDescription className="text-3xl font-bold font-space text-foreground">
              4.2 <span className="text-lg text-muted-foreground">GB</span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-2 w-full bg-secondary rounded-full mt-2 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500" 
                style={{ width: '45%' }}
              />
            </div>
            <div className="text-xs text-muted-foreground mt-1">4.2 / 10 GB used</div>
          </CardContent>
        </Card>

        <Card className="glass-panel">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">Weekly Activity</CardTitle>
              <Layers className="w-4 h-4 text-accent" />
            </div>
          </CardHeader>
          <CardContent className="h-[80px]">
            <ChartContainer config={chartConfig} className="h-full w-full">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorCode" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Area 
                  type="monotone" 
                  dataKey="code" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorCode)" 
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Main Search & Grid */}
      <Card className="glass-panel border-border/50 flex-1 min-h-[500px] flex flex-col">
        <div className="p-4 border-b border-border/50 flex items-center gap-4">
          <Command className="flex-1 rounded-lg border border-border/50 shadow-lg bg-background/80 backdrop-blur-sm">
            <CommandInput 
              placeholder="Search code snippets, prompts, or images..." 
              className="h-12 font-space"
              value={searchQuery}
              onValueChange={setSearchQuery}
            />
            <CommandList className="hidden">
              <CommandEmpty>No results found.</CommandEmpty>
            </CommandList>
          </Command>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="font-mono">{filteredItems.length}</span>
            <span>results</span>
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 custom-scrollbar overflow-auto">
          {filteredItems.map((item) => {
            const selected = isSelected(item.id);
            return (
              <HoverCard key={item.id} openDelay={300}>
                <HoverCardTrigger asChild>
                  <div 
                    onClick={() => toggleSelection(item)}
                    className={`group relative rounded-xl border p-4 transition-all duration-300 cursor-pointer hover:-translate-y-1 ${
                      selected 
                        ? 'border-primary bg-primary/10 shadow-neon-sm' 
                        : 'border-border/50 bg-card/80 hover:border-primary/50 hover:shadow-neon-sm'
                    }`}
                  >
                    {/* Selection Checkbox */}
                    <div className={`absolute top-3 right-3 transition-opacity ${selected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                      <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                        selected 
                          ? 'bg-primary border-primary' 
                          : 'border-muted-foreground/50 group-hover:border-primary/50'
                      }`}>
                        {selected && <Check className="w-3 h-3 text-primary-foreground" />}
                      </div>
                    </div>

                    <div className="flex justify-between items-start mb-3 pr-6">
                      <div className={`p-2 rounded-lg ${item.type === 'code' ? 'bg-primary/10 text-primary' : 'bg-accent/10 text-accent'}`}>
                        {item.type === 'code' ? <Code className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                      </div>
                      <Badge 
                        variant="outline" 
                        className={`text-[10px] font-mono ${item.type === 'code' ? 'border-primary/50 text-primary' : 'border-accent/50 text-accent'}`}
                      >
                        {item.lang}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-semibold text-sm line-clamp-1 font-space">
                        {item.title}
                      </h3>
                      <p className="text-xs text-muted-foreground line-clamp-3 font-mono bg-secondary/50 p-2 rounded-md border border-border/30">
                        {item.content}
                      </p>
                    </div>
                    <div className="mt-4 flex justify-between items-center">
                      <span className="text-[10px] text-muted-foreground">{item.time}</span>
                      <span className="text-[10px] text-muted-foreground font-mono">{item.tokens} tokens</span>
                    </div>
                  </div>
                </HoverCardTrigger>
                <HoverCardContent className="w-80 glass-panel border-primary/30" side="right">
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold font-space text-primary">Asset Details</h4>
                    <div className="space-y-2 text-xs text-muted-foreground">
                      <div className="flex justify-between">
                        <span>Source</span>
                        <span className="text-foreground">{item.source}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tokens</span>
                        <span className="text-foreground font-mono">{item.tokens.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Hash</span>
                        <span className="text-primary font-mono">{item.hash}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 pt-2 border-t border-border/50">
                      <Button size="sm" variant="outline" className="flex-1 text-xs h-7">
                        Preview
                      </Button>
                      <Button 
                        size="sm" 
                        className={`flex-1 text-xs h-7 ${selected ? 'bg-destructive hover:bg-destructive/90' : 'bg-primary/90 hover:bg-primary'}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSelection(item);
                        }}
                      >
                        {selected ? 'Remove' : 'Select'}
                      </Button>
                    </div>
                  </div>
                </HoverCardContent>
              </HoverCard>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

export default DataExplorer;
