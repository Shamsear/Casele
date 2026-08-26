import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const logs = await prisma.adminActivityLog.findMany({
      take: 50,
      orderBy: { createdAt: "desc" },
      include: {
        admin: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    const formattedLogs = logs.map((log) => {
      let detailsStr = "";
      if (typeof log.details === "string") {
        detailsStr = log.details;
      } else if (log.details) {
        detailsStr = JSON.stringify(log.details);
      }

      return {
        id: log.id,
        action: log.action,
        details: detailsStr || "System action",
        admin: log.admin?.name || log.admin?.email || "Administrator",
        time: formatLogTime(log.createdAt),
      };
    });

    return NextResponse.json({ logs: formattedLogs });
  } catch (error) {
    console.error("Admin fetch activity error:", error);
    return NextResponse.json({ error: "Failed to fetch activity" }, { status: 500 });
  }
}

function formatLogTime(date: Date): string {
  const diffMs = Date.now() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}
