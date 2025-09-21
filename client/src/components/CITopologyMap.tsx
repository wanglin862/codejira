import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Server, 
  Monitor, 
  Database, 
  Network,
  ArrowRight,
  ZoomIn,
  ZoomOut,
  Maximize2,
  AlertTriangle,
  Info
} from "lucide-react";
import type { ConfigurationItem, CIRelationship } from "@shared/schema";

interface CITopologyMapProps {
  centralCI: ConfigurationItem;
  relatedCIs?: ConfigurationItem[];
  relationships?: CIRelationship[];
  onCIClick?: (ci: ConfigurationItem) => void;
}

interface TopologyNode {
  id: string;
  ci: ConfigurationItem;
  x: number;
  y: number;
  level: number;
}

interface TopologyLink {
  source: string;
  target: string;
  type: string;
}

const getTypeIcon = (type: string, size = "w-6 h-6") => {
  const iconClass = `${size} text-primary`;
  switch (type.toLowerCase()) {
    case "server":
      return <Server className={iconClass} />;
    case "vm":
      return <Monitor className={iconClass} />;
    case "database":
      return <Database className={iconClass} />;
    case "network":
      return <Network className={iconClass} />;
    default:
      return <Server className={iconClass} />;
  }
};

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "active":
      return "border-green-500 bg-green-50 dark:bg-green-900/20";
    case "maintenance":
      return "border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20";
    case "inactive":
    case "decommissioned":
      return "border-red-500 bg-red-50 dark:bg-red-900/20";
    default:
      return "border-gray-300 bg-gray-50 dark:bg-gray-900/20";
  }
};

export default function CITopologyMap({ 
  centralCI, 
  relatedCIs = [], 
  relationships = [],
  onCIClick = (ci) => console.log("CI clicked:", ci.name)
}: CITopologyMapProps) {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  // todo: remove mock functionality
  const mockRelatedCIs: ConfigurationItem[] = relatedCIs.length > 0 ? relatedCIs : [
    {
      id: "2",
      name: "DB-PROD-01",
      type: "Database", 
      status: "Active",
      location: "DC-East",
      hostname: "db-prod-01.company.com",
      ipAddress: "192.168.1.10",
      environment: "Production",
      businessService: "E-commerce Platform",
      owner: "DBA Team",
      operatingSystem: "CentOS 8",
      metadata: null,
      createdAt: new Date("2025-09-15"),
      updatedAt: new Date("2025-09-20")
    },
    {
      id: "3", 
      name: "LB-PROD-01",
      type: "Network",
      status: "Active", 
      location: "DC-East",
      hostname: "lb-prod-01.company.com",
      ipAddress: "192.168.1.5",
      environment: "Production",
      businessService: "Load Balancing",
      owner: "Network Team",
      operatingSystem: "F5 TMOS",
      metadata: null,
      createdAt: new Date("2025-09-10"),
      updatedAt: new Date("2025-09-18")
    },
    {
      id: "4",
      name: "STORAGE-01", 
      type: "Storage",
      status: "Maintenance",
      location: "DC-East",
      hostname: "storage-01.company.com", 
      ipAddress: "192.168.1.20",
      environment: "Production",
      businessService: "Data Storage",
      owner: "Storage Team",
      operatingSystem: "NetApp ONTAP",
      metadata: null,
      createdAt: new Date("2025-09-05"),
      updatedAt: new Date("2025-09-22")
    }
  ];

  // Calculate topology layout
  const calculateLayout = (): { nodes: TopologyNode[], links: TopologyLink[] } => {
    const allCIs = [centralCI, ...mockRelatedCIs];
    const centerX = 300;
    const centerY = 200;
    const radius = 120;
    
    const nodes: TopologyNode[] = allCIs.map((ci, index) => {
      if (index === 0) {
        // Central node
        return { id: ci.id, ci, x: centerX, y: centerY, level: 0 };
      } else {
        // Arrange others in circle
        const angle = (2 * Math.PI * (index - 1)) / (allCIs.length - 1);
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        return { id: ci.id, ci, x, y, level: 1 };
      }
    });

    // todo: remove mock functionality - mock relationships
    const links: TopologyLink[] = [
      { source: centralCI.id, target: "2", type: "depends_on" },
      { source: centralCI.id, target: "3", type: "connects_to" },
      { source: centralCI.id, target: "4", type: "hosted_on" }
    ];

    return { nodes, links };
  };

  const { nodes, links } = calculateLayout();

  const zoomIn = () => setZoomLevel(prev => Math.min(prev + 0.2, 2));
  const zoomOut = () => setZoomLevel(prev => Math.max(prev - 0.2, 0.5));

  return (
    <Card className="w-full" data-testid="ci-topology-map">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Network className="w-5 h-5" />
            CI Topology Map
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={zoomOut} data-testid="button-zoom-out">
              <ZoomOut className="w-4 h-4" />
            </Button>
            <span className="text-sm text-muted-foreground">{Math.round(zoomLevel * 100)}%</span>
            <Button variant="outline" size="sm" onClick={zoomIn} data-testid="button-zoom-in">
              <ZoomIn className="w-4 h-4" />
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowDetails(!showDetails)}
              data-testid="button-toggle-details"
            >
              <Maximize2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="relative overflow-hidden border rounded-lg bg-background" style={{ minHeight: "400px" }}>
          {/* SVG for connections */}
          <svg 
            className="absolute inset-0 w-full h-full" 
            style={{ transform: `scale(${zoomLevel})` }}
            data-testid="topology-svg"
          >
            {links.map((link, index) => {
              const sourceNode = nodes.find(n => n.id === link.source);
              const targetNode = nodes.find(n => n.id === link.target);
              
              if (!sourceNode || !targetNode) return null;
              
              return (
                <g key={index}>
                  <line
                    x1={sourceNode.x}
                    y1={sourceNode.y}
                    x2={targetNode.x}
                    y2={targetNode.y}
                    stroke="hsl(var(--border))"
                    strokeWidth="2"
                    strokeDasharray={link.type === "depends_on" ? "5,5" : "none"}
                  />
                  {/* Relationship label */}
                  <text
                    x={(sourceNode.x + targetNode.x) / 2}
                    y={(sourceNode.y + targetNode.y) / 2 - 10}
                    fill="hsl(var(--muted-foreground))"
                    fontSize="10"
                    textAnchor="middle"
                    className="font-mono"
                  >
                    {link.type.replace('_', ' ')}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* CI Nodes */}
          {nodes.map((node) => (
            <div
              key={node.id}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all hover-elevate ${
                selectedNode === node.id ? "ring-2 ring-primary" : ""
              } ${getStatusColor(node.ci.status)} border-2 rounded-lg p-3 min-w-[120px]`}
              style={{
                left: `${node.x * zoomLevel}px`,
                top: `${node.y * zoomLevel}px`,
                transform: `translate(-50%, -50%) scale(${zoomLevel})`
              }}
              onClick={() => {
                setSelectedNode(node.id);
                onCIClick(node.ci);
              }}
              data-testid={`topology-node-${node.ci.name}`}
            >
              <div className="flex flex-col items-center gap-2">
                {getTypeIcon(node.ci.type)}
                <div className="text-center">
                  <div className="font-medium text-xs">{node.ci.name}</div>
                  <Badge variant="outline" className="text-xs mt-1">
                    {node.ci.status}
                  </Badge>
                </div>
                {node.ci.status !== "Active" && (
                  <AlertTriangle className="w-3 h-3 text-yellow-600" />
                )}
              </div>
            </div>
          ))}
        </div>

        {showDetails && selectedNode && (
          <>
            <Separator className="my-4" />
            <div className="space-y-2" data-testid="topology-details">
              {(() => {
                const node = nodes.find(n => n.id === selectedNode);
                if (!node) return null;
                const ci = node.ci;
                
                return (
                  <div className="bg-muted p-4 rounded-lg">
                    <h4 className="font-medium flex items-center gap-2">
                      <Info className="w-4 h-4" />
                      {ci.name} Details
                    </h4>
                    <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                      <div><span className="text-muted-foreground">Type:</span> {ci.type}</div>
                      <div><span className="text-muted-foreground">Status:</span> {ci.status}</div>
                      <div><span className="text-muted-foreground">Location:</span> {ci.location}</div>
                      <div><span className="text-muted-foreground">Environment:</span> {ci.environment}</div>
                      {ci.hostname && <div><span className="text-muted-foreground">Hostname:</span> {ci.hostname}</div>}
                      {ci.ipAddress && <div><span className="text-muted-foreground">IP:</span> {ci.ipAddress}</div>}
                    </div>
                  </div>
                );
              })()}
            </div>
          </>
        )}

        {/* Legend */}
        <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground flex-wrap" data-testid="topology-legend">
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 bg-border"></div>
            <span>connects_to</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 bg-border border-dashed"></div>
            <span>depends_on</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 border-2 border-green-500 rounded"></div>
            <span>Active</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 border-2 border-yellow-500 rounded"></div>
            <span>Maintenance</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 border-2 border-red-500 rounded"></div>
            <span>Inactive</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}