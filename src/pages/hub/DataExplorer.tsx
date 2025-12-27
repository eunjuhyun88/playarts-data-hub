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
import { AreaChart, Area } from 'recharts';
import { ChartContainer } from "@/components/ui/chart";
import { Code, FileText, Plus, TrendingUp, HardDrive, Layers } from "lucide-react";

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

const mockDataItems = [
  { id: 1, type: "code", title: "React Hook Authentication", content: "const useAuth = () => { const [user, setUser] = useState(null); useEffect(() => { ... ", lang: "TYPESCRIPT", time: "2 mins ago" },
  { id: 2, type: "prompt", title: "Cyberpunk City Prompt", content: "A futuristic city with neon lights, rain pouring down, reflecting on the wet pavement...", lang: "PROMPT", time: "5 mins ago" },
  { id: 3, type: "code", title: "Python Data Pipeline", content: "def process_data(df): return df.dropna().reset_index(drop=True).apply(lambda x: x.strip() if ...", lang: "PYTHON", time: "12 mins ago" },
  { id: 4, type: "prompt", title: "API Documentation Gen", content: "Generate comprehensive API documentation for a REST endpoint that handles user authentication...", lang: "PROMPT", time: "18 mins ago" },
  { id: 5, type: "code", title: "SQL Query Optimization", content: "SELECT u.id, u.name, COUNT(o.id) as order_count FROM users u LEFT JOIN orders o ON u.id = o.user_id...", lang: "SQL", time: "25 mins ago" },
  { id: 6, type: "prompt", title: "Machine Learning Explanation", content: "Explain the concept of gradient descent in machine learning, focusing on how it optimizes...", lang: "PROMPT", time: "32 mins ago" },
  { id: 7, type: "code", title: "Docker Compose Config", content: "version: '3.8' services: app: build: . ports: - '3000:3000' environment: - NODE_ENV=production...", lang: "YAML", time: "45 mins ago" },
  { id: 8, type: "prompt", title: "Code Review Guidelines", content: "Review this code for potential performance issues, security vulnerabilities, and best practices...", lang: "PROMPT", time: "1 hour ago" },
];

const DataExplorer = () => {
  return (
    <div className="space-y-6 animate-fade-in">
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
        <div className="p-4 border-b border-border/50">
          <Command className="rounded-lg border border-border/50 shadow-lg bg-background/80 backdrop-blur-sm">
            <CommandInput 
              placeholder="Search code snippets, prompts, or images..." 
              className="h-12 font-space"
            />
            <CommandList className="hidden">
              <CommandEmpty>No results found.</CommandEmpty>
            </CommandList>
          </Command>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 custom-scrollbar overflow-auto">
          {mockDataItems.map((item) => (
            <HoverCard key={item.id} openDelay={200}>
              <HoverCardTrigger asChild>
                <div className="group relative rounded-xl border border-border/50 bg-card/80 p-4 hover:border-primary/50 transition-all duration-300 cursor-pointer hover:shadow-neon-sm hover:-translate-y-1">
                  <div className="flex justify-between items-start mb-3">
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
                    <Button size="icon" variant="ghost" className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary/10 hover:text-primary">
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </HoverCardTrigger>
              <HoverCardContent className="w-80 glass-panel border-primary/30" side="right">
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold font-space text-primary">Asset Details</h4>
                  <div className="space-y-2 text-xs text-muted-foreground">
                    <p>Captured from <span className="text-foreground">Claude 3.5 Sonnet</span></p>
                    <p>Contains <span className="text-foreground font-mono">1,240 tokens</span></p>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-border/50">
                    <span className="text-xs text-muted-foreground">Hash</span>
                    <span className="text-xs font-mono text-primary">0x7f3...8a2</span>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button size="sm" variant="outline" className="flex-1 text-xs h-7">
                      Preview
                    </Button>
                    <Button size="sm" className="flex-1 text-xs h-7 bg-primary/90 hover:bg-primary">
                      Add to Dataset
                    </Button>
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default DataExplorer;
