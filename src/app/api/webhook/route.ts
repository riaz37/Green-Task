import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

// Webhook secret - should be stored in environment variable
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || "";

// Define a type for webhook data
type WebhookData = {
  eventType: string;
  data: Record<string, unknown>;
  timestamp?: string;
};

export async function POST(request: NextRequest) {
  try {
    // 1. Signature Verification
    const signature = request.headers.get("x-webhook-signature");
    const body = await request.text();

    if (!signature || !verifySignature(body, signature)) {
      return NextResponse.json(
        { success: false, message: "Invalid signature" },
        { status: 403 }
      );
    }

    // 2. Parse Request Data
    const payload = JSON.parse(body);
    const { eventType, data } = payload;

    // 3. Store Data in db.json
    await storeWebhookData({ eventType, data });

    // 4. Return Success Response
    return NextResponse.json(
      { success: true, message: "Received" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json(
      { success: false, message: "Error processing webhook" },
      { status: 500 }
    );
  }
}

// Signature Verification Function
function verifySignature(body: string, signature: string): boolean {
  const hmac = crypto.createHmac("sha256", WEBHOOK_SECRET);
  const computedSignature = hmac.update(body).digest("hex");
  return computedSignature === signature;
}

// Store Webhook Data Function
async function storeWebhookData(webhookData: WebhookData) {
  const dbPath = path.join(process.cwd(), "db.json");

  try {
    let existingData: WebhookData[] = [];

    try {
      const fileContent = await fs.readFile(dbPath, "utf-8");
      existingData = JSON.parse(fileContent);
    } catch {
      // File doesn't exist, will create a new one
    }

    existingData.push({
      ...webhookData,
      timestamp: new Date().toISOString(),
    });

    await fs.writeFile(dbPath, JSON.stringify(existingData, null, 2));
  } catch (error) {
    console.error("Error storing webhook data:", error);
    throw error;
  }
}
