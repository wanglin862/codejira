import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq, and } from "drizzle-orm";
import { 
  type User, 
  type InsertUser,
  type ConfigurationItem,
  type InsertCI,
  type Ticket,
  type InsertTicket,
  type SLAMetric,
  type InsertSLAMetric,
  type CIRelationship,
  users,
  configurationItems,
  tickets,
  slaMetrics,
  ciRelationships
} from "@shared/schema";

const sql = postgres(process.env.DATABASE_URL!);
const db = drizzle(sql);

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // CI methods
  getAllCIs(): Promise<ConfigurationItem[]>;
  getCIById(id: string): Promise<ConfigurationItem | undefined>;
  insertCI(ci: InsertCI): Promise<ConfigurationItem>;
  updateCI(id: string, ci: Partial<InsertCI>): Promise<ConfigurationItem | undefined>;
  deleteCI(id: string): Promise<boolean>;
  
  // Ticket methods
  getTickets(filters: Record<string, any>): Promise<Ticket[]>;
  getTicketById(id: string): Promise<Ticket | undefined>;
  insertTicket(ticket: InsertTicket): Promise<Ticket>;
  updateTicket(id: string, ticket: Partial<InsertTicket>): Promise<Ticket | undefined>;
  
  // SLA methods
  getSLAMetrics(): Promise<SLAMetric[]>;
  insertSLAMetric(metric: InsertSLAMetric): Promise<SLAMetric>;
  
  // CI Relationship methods
  getCIRelationships(ciId: string): Promise<CIRelationship[]>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  // CI methods
  async getAllCIs(): Promise<ConfigurationItem[]> {
    return await db.select().from(configurationItems);
  }

  async getCIById(id: string): Promise<ConfigurationItem | undefined> {
    const result = await db.select().from(configurationItems).where(eq(configurationItems.id, id));
    return result[0];
  }

  async insertCI(ci: InsertCI): Promise<ConfigurationItem> {
    const result = await db.insert(configurationItems).values(ci).returning();
    return result[0];
  }

  async updateCI(id: string, ci: Partial<InsertCI>): Promise<ConfigurationItem | undefined> {
    const result = await db.update(configurationItems)
      .set({ ...ci, updatedAt: new Date() })
      .where(eq(configurationItems.id, id))
      .returning();
    return result[0];
  }

  async deleteCI(id: string): Promise<boolean> {
    const result = await db.delete(configurationItems).where(eq(configurationItems.id, id));
    return result.count > 0;
  }

  // Ticket methods
  async getTickets(filters: Record<string, any>): Promise<Ticket[]> {
    let query = db.select().from(tickets);
    
    // Apply filters
    const conditions = [];
    if (filters.status) conditions.push(eq(tickets.status, filters.status));
    if (filters.priority) conditions.push(eq(tickets.priority, filters.priority));
    if (filters.ciId) conditions.push(eq(tickets.ciId, filters.ciId));
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    return await query;
  }

  async getTicketById(id: string): Promise<Ticket | undefined> {
    const result = await db.select().from(tickets).where(eq(tickets.id, id));
    return result[0];
  }

  async insertTicket(ticket: InsertTicket): Promise<Ticket> {
    const result = await db.insert(tickets).values(ticket).returning();
    return result[0];
  }

  async updateTicket(id: string, ticket: Partial<InsertTicket>): Promise<Ticket | undefined> {
    const result = await db.update(tickets)
      .set({ ...ticket, updatedAt: new Date() })
      .where(eq(tickets.id, id))
      .returning();
    return result[0];
  }

  // SLA methods
  async getSLAMetrics(): Promise<SLAMetric[]> {
    return await db.select().from(slaMetrics);
  }

  async insertSLAMetric(metric: InsertSLAMetric): Promise<SLAMetric> {
    const result = await db.insert(slaMetrics).values(metric).returning();
    return result[0];
  }

  // CI Relationship methods
  async getCIRelationships(ciId: string): Promise<CIRelationship[]> {
    return await db.select().from(ciRelationships)
      .where(eq(ciRelationships.sourceId, ciId));
  }
}

export const storage = new DatabaseStorage();
