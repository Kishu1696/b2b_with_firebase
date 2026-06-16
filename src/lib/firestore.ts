/**
 * firestore.ts — Firestore Database Service
 *
 * Saare collections:
 *   users · inventory · buyers · transactions · auctions · shipments · contracts
 *
 * Har collection ke liye:
 *   - getAll / getById
 *   - add / update / delete
 *   - real-time subscribe (onSnapshot)
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  type DocumentData,
  type QueryConstraint,
  type Unsubscribe,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Auction, Buyer, Contract, InventoryItem, Shipment, Transaction } from "@/types";

// ─── Collection Names ─────────────────────────────────────────────────────────

export const COL = {
  USERS:        "users",
  INVENTORY:    "inventory",
  BUYERS:       "buyers",
  TRANSACTIONS: "transactions",
  AUCTIONS:     "auctions",
  SHIPMENTS:    "shipments",
  CONTRACTS:    "contracts",
} as const;

// ─── Generic Helpers ──────────────────────────────────────────────────────────

export async function fsGet<T>(col: string, id: string): Promise<T | null> {
  const snap = await getDoc(doc(db, col, id));
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as T) : null;
}

export async function fsGetAll<T>(
  col: string,
  constraints: QueryConstraint[] = []
): Promise<T[]> {
  const ref = collection(db, col);
  const q   = constraints.length ? query(ref, ...constraints) : query(ref);
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as T));
}

/** Auto-ID create */
export async function fsAdd(col: string, data: DocumentData): Promise<string> {
  const ref = await addDoc(collection(db, col), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

/** Custom-ID create/overwrite */
export async function fsSet(col: string, id: string, data: DocumentData): Promise<void> {
  await setDoc(doc(db, col, id), { ...data, updatedAt: serverTimestamp() });
}

export async function fsUpdate(col: string, id: string, data: Partial<DocumentData>): Promise<void> {
  await updateDoc(doc(db, col, id), { ...data, updatedAt: serverTimestamp() });
}

export async function fsDelete(col: string, id: string): Promise<void> {
  await deleteDoc(doc(db, col, id));
}

export function fsSubscribe<T>(
  col: string,
  cb: (data: T[]) => void,
  constraints: QueryConstraint[] = []
): Unsubscribe {
  const ref = collection(db, col);
  const q   = constraints.length ? query(ref, ...constraints) : query(ref);
  return onSnapshot(q, (snap) => cb(snap.docs.map((d) => ({ id: d.id, ...d.data() } as T))));
}

export function fsSubscribeDoc<T>(
  col: string,
  id: string,
  cb: (data: T | null) => void
): Unsubscribe {
  return onSnapshot(doc(db, col, id), (snap) =>
    cb(snap.exists() ? ({ id: snap.id, ...snap.data() } as T) : null)
  );
}

// ─── User Profile ─────────────────────────────────────────────────────────────

export interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  company_name: string | null;
  role: "admin" | "seller" | "buyer" | "manager";
  is_verified: boolean;
  is_active: boolean;
  created_at: string;
}

export const getUserProfile  = (uid: string) => fsGet<UserProfile>(COL.USERS, uid);
export const setUserProfile  = (uid: string, data: Omit<UserProfile, "id">) => fsSet(COL.USERS, uid, data);
export const updateUserProfile = (uid: string, data: Partial<UserProfile>) => fsUpdate(COL.USERS, uid, data);

// ─── Inventory ────────────────────────────────────────────────────────────────

export const getInventory    = (n = 100) => fsGetAll<InventoryItem>(COL.INVENTORY, [orderBy("createdAt", "desc"), limit(n)]);
export const getInventoryItem = (id: string) => fsGet<InventoryItem>(COL.INVENTORY, id);
export const addInventoryItem = (item: Omit<InventoryItem, "id">) => fsAdd(COL.INVENTORY, item);
export const updateInventoryItem = (id: string, data: Partial<InventoryItem>) => fsUpdate(COL.INVENTORY, id, data);
export const deleteInventoryItem = (id: string) => fsDelete(COL.INVENTORY, id);
export const subscribeInventory  = (cb: (items: InventoryItem[]) => void, n = 100) =>
  fsSubscribe<InventoryItem>(COL.INVENTORY, cb, [orderBy("createdAt", "desc"), limit(n)]);

// ─── Buyers ───────────────────────────────────────────────────────────────────

export const getBuyers        = (n = 100) => fsGetAll<Buyer>(COL.BUYERS, [orderBy("createdAt", "desc"), limit(n)]);
export const getBuyer         = (id: string) => fsGet<Buyer>(COL.BUYERS, id);
export const addBuyer         = (b: Omit<Buyer, "id">) => fsAdd(COL.BUYERS, b);
export const updateBuyer      = (id: string, data: Partial<Buyer>) => fsUpdate(COL.BUYERS, id, data);
export const deleteBuyer      = (id: string) => fsDelete(COL.BUYERS, id);
export const getBuyersBySegment = (segment: string) =>
  fsGetAll<Buyer>(COL.BUYERS, [where("segment", "==", segment), orderBy("lifetimeValue", "desc")]);
export const subscribeBuyers  = (cb: (buyers: Buyer[]) => void) =>
  fsSubscribe<Buyer>(COL.BUYERS, cb, [orderBy("createdAt", "desc"), limit(100)]);

// ─── Transactions ─────────────────────────────────────────────────────────────

export const getTransactions      = (n = 200) => fsGetAll<Transaction>(COL.TRANSACTIONS, [orderBy("createdAt", "desc"), limit(n)]);
export const addTransaction        = (t: Omit<Transaction, "id">) => fsAdd(COL.TRANSACTIONS, t);
export const updateTransaction     = (id: string, data: Partial<Transaction>) => fsUpdate(COL.TRANSACTIONS, id, data);
export const getTransactionsByStatus = (status: Transaction["status"]) =>
  fsGetAll<Transaction>(COL.TRANSACTIONS, [where("status", "==", status), orderBy("createdAt", "desc")]);
export const subscribeTransactions = (cb: (txns: Transaction[]) => void, n = 100) =>
  fsSubscribe<Transaction>(COL.TRANSACTIONS, cb, [orderBy("createdAt", "desc"), limit(n)]);

// ─── Auctions ─────────────────────────────────────────────────────────────────

export const getAuctions       = () => fsGetAll<Auction>(COL.AUCTIONS, [orderBy("createdAt", "desc")]);
export const getActiveAuctions = () => fsGetAll<Auction>(COL.AUCTIONS, [where("status", "==", "Active"), orderBy("createdAt", "desc")]);
export const addAuction        = (a: Omit<Auction, "id">) => fsAdd(COL.AUCTIONS, a);
export const updateAuction     = (id: string, data: Partial<Auction>) => fsUpdate(COL.AUCTIONS, id, data);
export const subscribeAuctions = (cb: (auctions: Auction[]) => void) =>
  fsSubscribe<Auction>(COL.AUCTIONS, cb, [where("status", "==", "Active"), orderBy("createdAt", "desc")]);

// ─── Shipments ────────────────────────────────────────────────────────────────

export const getShipments    = (n = 100) => fsGetAll<Shipment>(COL.SHIPMENTS, [orderBy("createdAt", "desc"), limit(n)]);
export const addShipment     = (s: Omit<Shipment, "id">) => fsAdd(COL.SHIPMENTS, s);
export const updateShipment  = (id: string, data: Partial<Shipment>) => fsUpdate(COL.SHIPMENTS, id, data);
export const subscribeShipments = (cb: (shipments: Shipment[]) => void) =>
  fsSubscribe<Shipment>(COL.SHIPMENTS, cb, [orderBy("createdAt", "desc"), limit(100)]);

// ─── Contracts ────────────────────────────────────────────────────────────────

export const getContracts        = () => fsGetAll<Contract>(COL.CONTRACTS, [orderBy("createdAt", "desc")]);
export const addContract         = (c: Omit<Contract, "id">) => fsAdd(COL.CONTRACTS, c);
export const updateContract      = (id: string, data: Partial<Contract>) => fsUpdate(COL.CONTRACTS, id, data);
export const getContractsByStatus = (status: Contract["status"]) =>
  fsGetAll<Contract>(COL.CONTRACTS, [where("status", "==", status), orderBy("createdAt", "desc")]);
export const subscribeContracts  = (cb: (contracts: Contract[]) => void) =>
  fsSubscribe<Contract>(COL.CONTRACTS, cb, [orderBy("createdAt", "desc")]);
