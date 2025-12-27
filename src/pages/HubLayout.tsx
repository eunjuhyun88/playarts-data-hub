import { useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  Database,
  BrainCircuit,
  Search,
  Settings,
  Layers,
  Sparkles,
  Command as CommandIcon,
  LogOut,
  Zap,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { DataSelectionProvider, useDataSelection } from "@/contexts/DataSelectionContext";
import DataExplorer from "./hub/DataExplorer";
import DatasetStudio from "./hub/DatasetStudio";

type HubView = "explorer" | "studio" | "models" | "settings";

const HubContent = () => {
  const [currentView, setCurrentView] = useState<HubView>("explorer");
  const { selectedItems } = useDataSelection();

  return (
    <div className="flex min-h-screen w-full bg-background text-foreground">
      <Sidebar collapsible="icon" className="border-r border-border/30 bg-sidebar">
        <SidebarHeader className="h-16 flex items-center justify-center border-b border-border/30 bg-background/50 backdrop-blur-xl">
          <div className="flex items-center gap-2 font-space font-bold text-xl tracking-wider group-data-[collapsible=icon]:hidden">
            <Zap className="w-5 h-5 text-primary" />
            PLAY<span className="text-primary text-shadow-neon">HUB</span>
          </div>
          <div className="hidden group-data-[collapsible=icon]:block text-primary">
            <Sparkles className="w-6 h-6" />
          </div>
        </SidebarHeader>

        <SidebarContent className="custom-scrollbar">
          <SidebarGroup>
            <SidebarGroupLabel className="text-muted-foreground/70 text-[10px] font-space tracking-widest">
              WORKFLOW
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    isActive={currentView === "explorer"} 
                    onClick={() => setCurrentView("explorer")}
                    tooltip="Data Lake"
                    className="transition-all hover:bg-primary/10 data-[active=true]:bg-primary/15 data-[active=true]:text-primary data-[active=true]:border-l-2 data-[active=true]:border-primary"
                  >
                    <Database className="w-4 h-4" />
                    <span className="font-space">1. Data Lake</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    isActive={currentView === "studio"} 
                    onClick={() => setCurrentView("studio")}
                    tooltip="Dataset Studio"
                    className="transition-all hover:bg-primary/10 data-[active=true]:bg-primary/15 data-[active=true]:text-primary data-[active=true]:border-l-2 data-[active=true]:border-primary"
                  >
                    <Layers className="w-4 h-4" />
                    <span className="font-space">2. Dataset Studio</span>
                    {selectedItems.length > 0 && (
                      <Badge className="ml-auto bg-primary text-primary-foreground text-[10px] px-1.5 py-0 h-5 min-w-5 flex items-center justify-center">
                        {selectedItems.length}
                      </Badge>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    isActive={currentView === "models"} 
                    onClick={() => setCurrentView("models")}
                    tooltip="Training Jobs"
                    className="transition-all hover:bg-primary/10 data-[active=true]:bg-primary/15 data-[active=true]:text-primary data-[active=true]:border-l-2 data-[active=true]:border-primary"
                  >
                    <BrainCircuit className="w-4 h-4" />
                    <span className="font-space">3. Training</span>
                    <Badge variant="outline" className="ml-auto text-[9px] px-1.5 py-0 border-accent/50 text-accent bg-accent/10">
                      SOON
                    </Badge>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel className="text-muted-foreground/70 text-[10px] font-space tracking-widest">
              TOOLS
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    tooltip="Deep Search"
                    className="hover:bg-primary/10"
                  >
                    <Search className="w-4 h-4" />
                    <span className="font-space">Deep Search</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    tooltip="Command Center"
                    className="hover:bg-primary/10"
                  >
                    <CommandIcon className="w-4 h-4" />
                    <span className="font-space">Command</span>
                    <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-border/50 bg-muted px-1.5 font-mono text-[9px] font-medium text-muted-foreground">
                      ⌘K
                    </kbd>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="border-t border-border/30">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton 
                tooltip="Settings"
                className="hover:bg-primary/10"
              >
                <Settings className="w-4 h-4" />
                <span className="font-space">Settings</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton 
                tooltip="Disconnect"
                className="text-destructive/80 hover:text-destructive hover:bg-destructive/10"
              >
                <LogOut className="w-4 h-4" />
                <span className="font-space">Disconnect</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden relative flex flex-col">
        <header className="h-16 border-b border-border/30 flex items-center px-6 bg-background/80 backdrop-blur-xl justify-between sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="hover:bg-primary/10 hover:text-primary transition-colors" />
            <Separator orientation="vertical" className="h-6 bg-border/50" />
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-space font-medium text-foreground">
                {currentView === "explorer" && "Data Lake"}
                {currentView === "studio" && "Dataset Studio"}
                {currentView === "models" && "Training Jobs"}
              </h2>
              <span className="text-muted-foreground/50">/</span>
              <span className="text-sm text-muted-foreground">
                {currentView === "explorer" && "Select Data"}
                {currentView === "studio" && "Process & Export"}
                {currentView === "models" && "Fine-tune"}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {/* Workflow Progress Indicator */}
            <div className="flex items-center gap-1">
              <div className={`w-2.5 h-2.5 rounded-full transition-colors ${currentView === 'explorer' ? 'bg-primary shadow-[0_0_8px_hsl(var(--primary))]' : 'bg-primary/30'}`} />
              <div className={`w-8 h-0.5 ${currentView === 'studio' || currentView === 'models' ? 'bg-primary' : 'bg-border'}`} />
              <div className={`w-2.5 h-2.5 rounded-full transition-colors ${currentView === 'studio' ? 'bg-primary shadow-[0_0_8px_hsl(var(--primary))]' : selectedItems.length > 0 ? 'bg-primary/50' : 'bg-border'}`} />
              <div className={`w-8 h-0.5 ${currentView === 'models' ? 'bg-primary' : 'bg-border'}`} />
              <div className={`w-2.5 h-2.5 rounded-full transition-colors ${currentView === 'models' ? 'bg-primary shadow-[0_0_8px_hsl(var(--primary))]' : 'bg-border'}`} />
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/30">
              <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse shadow-[0_0_8px_hsl(var(--neon-green))]"></div>
              <span className="text-xs font-mono text-primary font-medium">ONLINE</span>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-6 custom-scrollbar grid-pattern">
          {currentView === "explorer" && (
            <DataExplorer onNavigateToStudio={() => setCurrentView("studio")} />
          )}
          {currentView === "studio" && <DatasetStudio />}
          {currentView === "models" && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center space-y-4">
                <div className="w-20 h-20 rounded-2xl bg-accent/10 border border-accent/30 flex items-center justify-center mx-auto">
                  <BrainCircuit className="w-10 h-10 text-accent" />
                </div>
                <h3 className="text-xl font-space font-semibold">Training Pipeline</h3>
                <p className="text-muted-foreground text-sm max-w-md">
                  Fine-tune AI models with your curated datasets. This module is coming soon.
                </p>
                <Badge className="bg-accent/20 text-accent border-accent/50 hover:bg-accent/30">
                  Coming Soon
                </Badge>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

const HubLayout = () => {
  return (
    <DataSelectionProvider>
      <SidebarProvider>
        <HubContent />
      </SidebarProvider>
    </DataSelectionProvider>
  );
};

export default HubLayout;
