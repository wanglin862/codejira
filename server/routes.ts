import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCISchema, insertTicketSchema, insertSLAMetricSchema } from "@shared/schema";
import { z } from "zod";

// Error handler wrapper
const asyncHandler = (fn: Function) => (req: Request, res: Response, next: Function) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Validation middleware
const validateBody = (schema: z.ZodSchema) => (req: Request, res: Response, next: Function) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation failed',
        details: error.errors
      });
    }
    next(error);
  }
};

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Health check
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
  });

  // Configuration Items (CIs) Routes
  app.get('/api/cis', asyncHandler(async (req: Request, res: Response) => {
    try {
      const cis = await storage.getAllCIs();
      res.json({ success: true, data: cis });
    } catch (error) {
      console.error('Error fetching CIs:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to fetch configuration items' 
      });
    }
  }));

  app.get('/api/cis/:id', asyncHandler(async (req: Request, res: Response) => {
    try {
      const ci = await storage.getCIById(req.params.id);
      if (!ci) {
        return res.status(404).json({ 
          success: false, 
          error: 'Configuration item not found' 
        });
      }
      res.json({ success: true, data: ci });
    } catch (error) {
      console.error('Error fetching CI:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to fetch configuration item' 
      });
    }
  }));

  app.post('/api/cis', 
    validateBody(insertCISchema),
    asyncHandler(async (req: Request, res: Response) => {
      try {
        const ci = await storage.insertCI(req.body);
        res.status(201).json({ success: true, data: ci });
      } catch (error) {
        console.error('Error creating CI:', error);
        res.status(500).json({ 
          success: false, 
          error: 'Failed to create configuration item' 
        });
      }
    })
  );

  app.put('/api/cis/:id',
    validateBody(insertCISchema.partial()),
    asyncHandler(async (req: Request, res: Response) => {
      try {
        const ci = await storage.updateCI(req.params.id, req.body);
        if (!ci) {
          return res.status(404).json({ 
            success: false, 
            error: 'Configuration item not found' 
          });
        }
        res.json({ success: true, data: ci });
      } catch (error) {
        console.error('Error updating CI:', error);
        res.status(500).json({ 
          success: false, 
          error: 'Failed to update configuration item' 
        });
      }
    })
  );

  app.delete('/api/cis/:id', asyncHandler(async (req: Request, res: Response) => {
    try {
      const success = await storage.deleteCI(req.params.id);
      if (!success) {
        return res.status(404).json({ 
          success: false, 
          error: 'Configuration item not found' 
        });
      }
      res.json({ success: true, message: 'Configuration item deleted' });
    } catch (error) {
      console.error('Error deleting CI:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to delete configuration item' 
      });
    }
  }));

  // Tickets Routes
  app.get('/api/tickets', asyncHandler(async (req: Request, res: Response) => {
    try {
      const { status, priority, ciId } = req.query;
      const filters: any = {};
      
      if (status) filters.status = status;
      if (priority) filters.priority = priority;
      if (ciId) filters.ciId = ciId;

      const tickets = await storage.getTickets(filters);
      res.json({ success: true, data: tickets });
    } catch (error) {
      console.error('Error fetching tickets:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to fetch tickets' 
      });
    }
  }));

  app.get('/api/tickets/:id', asyncHandler(async (req: Request, res: Response) => {
    try {
      const ticket = await storage.getTicketById(req.params.id);
      if (!ticket) {
        return res.status(404).json({ 
          success: false, 
          error: 'Ticket not found' 
        });
      }
      res.json({ success: true, data: ticket });
    } catch (error) {
      console.error('Error fetching ticket:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to fetch ticket' 
      });
    }
  }));

  app.post('/api/tickets',
    validateBody(insertTicketSchema),
    asyncHandler(async (req: Request, res: Response) => {
      try {
        const ticket = await storage.insertTicket(req.body);
        res.status(201).json({ success: true, data: ticket });
      } catch (error) {
        console.error('Error creating ticket:', error);
        res.status(500).json({ 
          success: false, 
          error: 'Failed to create ticket' 
        });
      }
    })
  );

  app.put('/api/tickets/:id',
    validateBody(insertTicketSchema.partial()),
    asyncHandler(async (req: Request, res: Response) => {
      try {
        const ticket = await storage.updateTicket(req.params.id, req.body);
        if (!ticket) {
          return res.status(404).json({ 
            success: false, 
            error: 'Ticket not found' 
          });
        }
        res.json({ success: true, data: ticket });
      } catch (error) {
        console.error('Error updating ticket:', error);
        res.status(500).json({ 
          success: false, 
          error: 'Failed to update ticket' 
        });
      }
    })
  );

  // SLA Metrics Routes
  app.get('/api/sla-metrics', asyncHandler(async (req: Request, res: Response) => {
    try {
      const metrics = await storage.getSLAMetrics();
      res.json({ success: true, data: metrics });
    } catch (error) {
      console.error('Error fetching SLA metrics:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to fetch SLA metrics' 
      });
    }
  }));

  app.post('/api/sla-metrics',
    validateBody(insertSLAMetricSchema),
    asyncHandler(async (req: Request, res: Response) => {
      try {
        const metric = await storage.insertSLAMetric(req.body);
        res.status(201).json({ success: true, data: metric });
      } catch (error) {
        console.error('Error creating SLA metric:', error);
        res.status(500).json({ 
          success: false, 
          error: 'Failed to create SLA metric' 
        });
      }
    })
  );

  // Dashboard Data Route
  app.get('/api/dashboard', asyncHandler(async (req: Request, res: Response) => {
    try {
      const [cis, tickets, slaMetrics] = await Promise.all([
        storage.getAllCIs(),
        storage.getTickets({}),
        storage.getSLAMetrics()
      ]);

      const dashboardData = {
        totalCIs: cis.length,
        totalTickets: tickets.length,
        openTickets: tickets.filter(t => !['Resolved', 'Closed'].includes(t.status)).length,
        breachedSLAs: slaMetrics.filter(m => m.breached === 'true').length,
        ticketsByStatus: tickets.reduce((acc, ticket) => {
          acc[ticket.status] = (acc[ticket.status] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        ticketsByPriority: tickets.reduce((acc, ticket) => {
          acc[ticket.priority] = (acc[ticket.priority] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        recentTickets: tickets.slice(0, 10),
        recentCIs: cis.slice(0, 10)
      };

      res.json({ success: true, data: dashboardData });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to fetch dashboard data' 
      });
    }
  }));

  // CI Relationships Routes
  app.get('/api/cis/:id/relationships', asyncHandler(async (req: Request, res: Response) => {
    try {
      const relationships = await storage.getCIRelationships(req.params.id);
      res.json({ success: true, data: relationships });
    } catch (error) {
      console.error('Error fetching CI relationships:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to fetch CI relationships' 
      });
    }
  }));

  // Tickets related to CI
  app.get('/api/cis/:id/tickets', asyncHandler(async (req: Request, res: Response) => {
    try {
      const tickets = await storage.getTickets({ ciId: req.params.id });
      res.json({ success: true, data: tickets });
    } catch (error) {
      console.error('Error fetching CI tickets:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to fetch tickets for CI' 
      });
    }
  }));

  const httpServer = createServer(app);

  return httpServer;
}
