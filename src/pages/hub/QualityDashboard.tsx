import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from "recharts";
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle2, 
  Code, 
  FileText, 
  Sparkles,
  Zap,
  Target,
  BarChart3,
  PieChart as PieChartIcon,
  Activity
} from "lucide-react";
import { useDataSelection } from "@/contexts/DataSelectionContext";

const QualityDashboard = () => {
  const { selectedItems } = useDataSelection();
  
  // Calculate statistics from selected items
  const stats = useMemo(() => {
    if (selectedItems.length === 0) {
      return {
        totalItems: 0,
        totalTokens: 0,
        avgTokens: 0,
        codeCount: 0,
        promptCount: 0,
        avgQuality: 0,
        qualityDistribution: [],
        tokenDistribution: [],
        typeDistribution: [],
        languageDistribution: [],
        timeDistribution: [],
        sourceDistribution: []
      };
    }

    const totalTokens = selectedItems.reduce((sum, item) => sum + item.tokens, 0);
    const avgTokens = Math.round(totalTokens / selectedItems.length);
    const codeCount = selectedItems.filter(item => item.type === 'code').length;
    const promptCount = selectedItems.filter(item => item.type === 'prompt').length;

    // Simulate quality scores (in real app, these would come from AI processing)
    const qualityScores = selectedItems.map(() => Math.floor(Math.random() * 40) + 60);
    const avgQuality = Math.round(qualityScores.reduce((a, b) => a + b, 0) / qualityScores.length);

    // Quality distribution buckets
    const qualityDistribution = [
      { range: '90-100', count: qualityScores.filter(s => s >= 90).length, fill: 'hsl(var(--neon-green))' },
      { range: '80-89', count: qualityScores.filter(s => s >= 80 && s < 90).length, fill: 'hsl(var(--primary))' },
      { range: '70-79', count: qualityScores.filter(s => s >= 70 && s < 80).length, fill: 'hsl(var(--accent))' },
      { range: '60-69', count: qualityScores.filter(s => s >= 60 && s < 70).length, fill: 'hsl(var(--neon-orange))' },
      { range: '<60', count: qualityScores.filter(s => s < 60).length, fill: 'hsl(var(--destructive))' },
    ];

    // Token size distribution
    const tokenDistribution = [
      { range: '0-100', count: selectedItems.filter(i => i.tokens <= 100).length },
      { range: '100-500', count: selectedItems.filter(i => i.tokens > 100 && i.tokens <= 500).length },
      { range: '500-1000', count: selectedItems.filter(i => i.tokens > 500 && i.tokens <= 1000).length },
      { range: '1000+', count: selectedItems.filter(i => i.tokens > 1000).length },
    ];

    // Type distribution for pie chart
    const typeDistribution = [
      { name: 'Code', value: codeCount, fill: 'hsl(var(--primary))' },
      { name: 'Prompts', value: promptCount, fill: 'hsl(var(--accent))' },
    ];

    // Language distribution (simulated from items)
    const languages = ['Python', 'TypeScript', 'JavaScript', 'Rust', 'Go'];
    const languageDistribution = languages.map((lang, i) => ({
      name: lang,
      count: Math.floor(codeCount * (0.3 - i * 0.05)) + 1
    })).filter(l => l.count > 0);

    // Time-based distribution (last 7 days simulation)
    const timeDistribution = Array.from({ length: 7 }, (_, i) => ({
      day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
      items: Math.floor(Math.random() * 20) + 5,
      quality: Math.floor(Math.random() * 15) + 75
    }));

    // Source distribution
    const sources = ['GitHub', 'StackOverflow', 'Discord', 'Manual'];
    const sourceDistribution = sources.map(source => ({
      name: source,
      value: Math.floor(Math.random() * selectedItems.length / 3) + 1
    }));

    return {
      totalItems: selectedItems.length,
      totalTokens,
      avgTokens,
      codeCount,
      promptCount,
      avgQuality,
      qualityDistribution,
      tokenDistribution,
      typeDistribution,
      languageDistribution,
      timeDistribution,
      sourceDistribution
    };
  }, [selectedItems]);

  const COLORS = ['hsl(var(--primary))', 'hsl(var(--accent))', 'hsl(var(--neon-green))', 'hsl(var(--neon-orange))'];

  if (selectedItems.length === 0) {
    return (
      <div className="h-[calc(100vh-8rem)] w-full rounded-xl border border-border/50 bg-background/50 backdrop-blur-sm flex items-center justify-center animate-fade-in">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto">
            <BarChart3 className="w-10 h-10 text-primary" />
          </div>
          <h3 className="text-xl font-space font-semibold">Quality Dashboard</h3>
          <p className="text-muted-foreground text-sm max-w-md">
            Select items from Data Lake to view quality metrics and statistics.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-8rem)] w-full rounded-xl border border-border/50 bg-background/50 backdrop-blur-sm overflow-hidden animate-fade-in">
      <ScrollArea className="h-full">
        <div className="p-6 space-y-6">
          {/* Header Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-card/50 border-border/50 hover:border-primary/30 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground font-space">Total Items</p>
                    <p className="text-2xl font-bold font-mono text-primary">{stats.totalItems}</p>
                  </div>
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Sparkles className="w-5 h-5 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border/50 hover:border-accent/30 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground font-space">Total Tokens</p>
                    <p className="text-2xl font-bold font-mono text-accent">{stats.totalTokens.toLocaleString()}</p>
                  </div>
                  <div className="p-2 rounded-lg bg-accent/10">
                    <Zap className="w-5 h-5 text-accent" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border/50 hover:border-neon-green/30 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground font-space">Avg Quality</p>
                    <div className="flex items-center gap-2">
                      <p className="text-2xl font-bold font-mono" style={{ color: 'hsl(var(--neon-green))' }}>
                        {stats.avgQuality}%
                      </p>
                      {stats.avgQuality >= 80 ? (
                        <TrendingUp className="w-4 h-4 text-neon-green" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-neon-orange" />
                      )}
                    </div>
                  </div>
                  <div className="p-2 rounded-lg bg-neon-green/10">
                    <Target className="w-5 h-5 text-neon-green" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border/50 hover:border-neon-orange/30 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground font-space">Avg Tokens/Item</p>
                    <p className="text-2xl font-bold font-mono" style={{ color: 'hsl(var(--neon-orange))' }}>
                      {stats.avgTokens}
                    </p>
                  </div>
                  <div className="p-2 rounded-lg bg-neon-orange/10">
                    <Activity className="w-5 h-5 text-neon-orange" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Quality Distribution */}
            <Card className="bg-card/50 border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-space flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-primary" />
                  Quality Score Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.qualityDistribution}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                      <XAxis 
                        dataKey="range" 
                        tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                        axisLine={{ stroke: 'hsl(var(--border))' }}
                      />
                      <YAxis 
                        tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                        axisLine={{ stroke: 'hsl(var(--border))' }}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                          fontSize: '12px'
                        }}
                      />
                      <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                        {stats.qualityDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Type Distribution Pie */}
            <Card className="bg-card/50 border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-space flex items-center gap-2">
                  <PieChartIcon className="w-4 h-4 text-accent" />
                  Data Type Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] flex items-center justify-center gap-8">
                  <ResponsiveContainer width="50%" height="100%">
                    <PieChart>
                      <Pie
                        data={stats.typeDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={70}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {stats.typeDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                          fontSize: '12px'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Code className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Code Snippets</p>
                        <p className="font-mono font-bold text-primary">{stats.codeCount}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-accent/10">
                        <FileText className="w-4 h-4 text-accent" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Prompts</p>
                        <p className="font-mono font-bold text-accent">{stats.promptCount}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Row 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Token Distribution */}
            <Card className="bg-card/50 border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-space flex items-center gap-2">
                  <Zap className="w-4 h-4 text-neon-orange" />
                  Token Size Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[180px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.tokenDistribution} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                      <XAxis 
                        type="number"
                        tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                        axisLine={{ stroke: 'hsl(var(--border))' }}
                      />
                      <YAxis 
                        dataKey="range" 
                        type="category"
                        tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                        axisLine={{ stroke: 'hsl(var(--border))' }}
                        width={60}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                          fontSize: '12px'
                        }}
                      />
                      <Bar dataKey="count" fill="hsl(var(--neon-orange))" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Quality Trend */}
            <Card className="bg-card/50 border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-space flex items-center gap-2">
                  <Activity className="w-4 h-4 text-neon-green" />
                  Collection Activity (7 Days)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[180px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={stats.timeDistribution}>
                      <defs>
                        <linearGradient id="colorItems" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                      <XAxis 
                        dataKey="day" 
                        tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                        axisLine={{ stroke: 'hsl(var(--border))' }}
                      />
                      <YAxis 
                        tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                        axisLine={{ stroke: 'hsl(var(--border))' }}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                          fontSize: '12px'
                        }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="items" 
                        stroke="hsl(var(--primary))" 
                        fill="url(#colorItems)"
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Language Distribution & Quality Indicators */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Language Stats */}
            <Card className="bg-card/50 border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-space flex items-center gap-2">
                  <Code className="w-4 h-4 text-primary" />
                  Top Languages
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {stats.languageDistribution.slice(0, 5).map((lang, i) => (
                    <div key={lang.name} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="font-space">{lang.name}</span>
                        <span className="font-mono text-muted-foreground">{lang.count}</span>
                      </div>
                      <Progress 
                        value={(lang.count / Math.max(...stats.languageDistribution.map(l => l.count))) * 100} 
                        className="h-1.5"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quality Indicators */}
            <Card className="bg-card/50 border-border/50 col-span-1 lg:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-space flex items-center gap-2">
                  <Target className="w-4 h-4 text-neon-green" />
                  Quality Indicators
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg bg-neon-green/5 border border-neon-green/20">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className="w-4 h-4 text-neon-green" />
                      <span className="text-xs font-space">High Quality</span>
                    </div>
                    <p className="text-2xl font-mono font-bold text-neon-green">
                      {stats.qualityDistribution.slice(0, 2).reduce((a, b) => a + b.count, 0)}
                    </p>
                    <p className="text-[10px] text-muted-foreground">items scoring 80%+</p>
                  </div>
                  
                  <div className="p-3 rounded-lg bg-neon-orange/5 border border-neon-orange/20">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="w-4 h-4 text-neon-orange" />
                      <span className="text-xs font-space">Needs Review</span>
                    </div>
                    <p className="text-2xl font-mono font-bold text-neon-orange">
                      {stats.qualityDistribution.slice(3).reduce((a, b) => a + b.count, 0)}
                    </p>
                    <p className="text-[10px] text-muted-foreground">items scoring below 70%</p>
                  </div>

                  <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-4 h-4 text-primary" />
                      <span className="text-xs font-space">Ready for Training</span>
                    </div>
                    <p className="text-2xl font-mono font-bold text-primary">
                      {Math.round(stats.totalItems * 0.85)}
                    </p>
                    <p className="text-[10px] text-muted-foreground">estimated usable items</p>
                  </div>

                  <div className="p-3 rounded-lg bg-accent/5 border border-accent/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="w-4 h-4 text-accent" />
                      <span className="text-xs font-space">Dataset Size</span>
                    </div>
                    <p className="text-2xl font-mono font-bold text-accent">
                      {(stats.totalTokens * 0.004).toFixed(1)} KB
                    </p>
                    <p className="text-[10px] text-muted-foreground">estimated file size</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default QualityDashboard;
