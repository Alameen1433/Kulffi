"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useCart } from "@/hooks/useCart";
import type { Order, OrderStatus } from "@/hooks/useCart";
import {
  Package,
  Truck,
  MapPin,
  CheckCircle2,
  Clock,
  AlertCircle,
  ChevronRight,
  Calendar,
} from "lucide-react";

const statusConfig: Record<
  OrderStatus,
  { label: string; icon: React.ReactNode; color: string; bgColor: string }
> = {
  confirmed: {
    label: "Order Confirmed",
    icon: <CheckCircle2 className="h-5 w-5" />,
    color: "text-[#A31D1D]",
    bgColor: "bg-[#A31D1D]",
  },
  processing: {
    label: "Processing",
    icon: <Clock className="h-5 w-5" />,
    color: "text-amber-600",
    bgColor: "bg-amber-600",
  },
  shipped: {
    label: "Shipped",
    icon: <Package className="h-5 w-5" />,
    color: "text-blue-600",
    bgColor: "bg-blue-600",
  },
  out_for_delivery: {
    label: "Out for Delivery",
    icon: <Truck className="h-5 w-5" />,
    color: "text-violet-600",
    bgColor: "bg-violet-600",
  },
  delivered: {
    label: "Delivered",
    icon: <MapPin className="h-5 w-5" />,
    color: "text-emerald-600",
    bgColor: "bg-emerald-600",
  },
  cancelled: {
    label: "Cancelled",
    icon: <AlertCircle className="h-5 w-5" />,
    color: "text-red-600",
    bgColor: "bg-red-600",
  },
};

const statusFlow: OrderStatus[] = [
  "confirmed",
  "processing",
  "shipped",
  "out_for_delivery",
  "delivered",
];

function formatDate(isoString: string) {
  const d = new Date(isoString);
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatTime(isoString: string) {
  const d = new Date(isoString);
  return d.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function OrderTimeline({ order }: { order: Order }) {
  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (timelineRef.current) {
      gsap.fromTo(
        timelineRef.current.querySelectorAll(".timeline-item"),
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.4, stagger: 0.1, ease: "power2.out" }
      );
    }
  }, []);

  const currentStatusIndex = statusFlow.indexOf(order.status || "confirmed");

  return (
    <div ref={timelineRef} className="relative pl-1 md:pl-4">
      {/* Vertical line */}
      <div className="absolute left-[20px] md:left-[27px] top-2 bottom-2 w-[2px] bg-[#A31D1D]/10 rounded-full" />

      <div className="flex flex-col gap-6">
        {statusFlow.map((status, index) => {
          const isCompleted = index <= currentStatusIndex && order.status !== "cancelled";
          const isCurrent = index === currentStatusIndex && order.status !== "cancelled";
          const config = statusConfig[status];
          const historyEvent = order.statusHistory.find((h) => h.status === status);

          return (
            <div
              key={status}
              className={`timeline-item relative flex items-start gap-3 md:gap-4 transition-all duration-300 ${
                isCompleted ? "opacity-100" : "opacity-40"
              }`}
            >
              {/* Dot / Icon */}
              <div
                className={`relative z-10 flex items-center justify-center h-9 w-9 md:h-10 md:w-10 shrink-0 rounded-full border-2 transition-all duration-300 ${
                  isCurrent
                    ? `${config.bgColor} border-transparent text-white shadow-[3px_3px_0_#2A1810] scale-110`
                    : isCompleted
                    ? `${config.bgColor} border-transparent text-white`
                    : "bg-white border-[#A31D1D]/20 text-[#A31D1D]/40"
                }`}
              >
                {config.icon}
              </div>

              {/* Content */}
              <div className="flex-1 pt-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`font-display font-bold text-xs md:text-sm uppercase tracking-wider ${
                      isCurrent ? config.color : "text-[#A31D1D]"
                    }`}
                  >
                    {config.label}
                  </span>
                  {isCurrent && (
                    <span className="px-2 py-0.5 rounded-full bg-[#A31D1D]/10 text-[10px] font-bold uppercase tracking-wider text-[#A31D1D]">
                      Current
                    </span>
                  )}
                </div>
                {historyEvent ? (
                  <p className="text-[11px] md:text-xs text-[#A31D1D]/60 mt-1">
                    {historyEvent.message} &middot; {formatDate(historyEvent.timestamp)} at{" "}
                    {formatTime(historyEvent.timestamp)}
                  </p>
                ) : (
                  <p className="text-xs text-[#A31D1D]/40 mt-1">Pending</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function OrderCard({ order, index }: { order: Order; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.5, delay: index * 0.1, ease: "power2.out" }
      );
    }
  }, [index]);

  const statusCfg = statusConfig[order.status] || statusConfig.confirmed;
  const totalItems = order.items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <div
      ref={cardRef}
      className="group rounded-xl md:rounded-2xl border-2 border-[#A31D1D]/10 bg-white/60 backdrop-blur-sm overflow-hidden transition-all duration-300 hover:border-[#A31D1D]/30 hover:shadow-[6px_6px_0_#A31D1D]/10"
    >
      {/* Header */}
      <div className="px-4 py-4 md:px-6 md:py-5 border-b-2 border-[#A31D1D]/10">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 md:gap-3 mb-1 flex-wrap">
              <span className="font-mono text-xs md:text-sm font-bold text-[#A31D1D]">{order.id}</span>
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-white ${statusCfg.bgColor}`}
              >
                {statusCfg.icon && <span className="scale-75">{statusCfg.icon}</span>}
                {statusCfg.label}
              </span>
            </div>
            <p className="text-[11px] text-[#A31D1D]/50">
              Placed on {formatDate(order.date)} &middot; {totalItems} item{totalItems > 1 ? "s" : ""}
            </p>
          </div>
          <div className="w-full text-left sm:w-auto sm:text-right">
            <p className="font-display font-bold text-lg text-[#A31D1D]">${order.total.toFixed(2)}</p>
            <p className="text-[11px] text-[#A31D1D]/50 flex items-center justify-end gap-1">
              <Calendar className="h-3 w-3" />
              Est. delivery: {formatDate(order.estimatedDelivery)}
            </p>
          </div>
        </div>
      </div>

      {/* Items Preview */}
      <div className="px-4 py-4 md:px-6">
        <div className="flex items-center gap-3 overflow-x-auto pb-2">
          {order.items.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3 p-2 rounded-xl border border-[#A31D1D]/10 bg-white/50 shrink-0"
            >
              <img
                src={item.image}
                alt={item.name}
                className="h-12 w-12 rounded-lg object-cover border border-[#A31D1D]/10"
              />
              <div>
                <p className="font-display font-bold text-xs uppercase tracking-wider text-[#A31D1D]">
                  {item.name}
                </p>
                <p className="text-[11px] text-[#A31D1D]/50">
                  Qty: {item.quantity} &middot; ${item.price.toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div className="px-4 pb-5 pt-2 md:px-6 md:pb-6">
        <OrderTimeline order={order} />
      </div>

      {/* Footer */}
      <div className="px-4 py-4 md:px-6 bg-[#FCE9D5]/40 border-t-2 border-[#A31D1D]/10">
        <div className="flex items-center justify-between gap-3">
          <div className="text-[11px] text-[#A31D1D]/50">
            <span className="font-semibold">Ship to:</span> {order.shipping.fullName}, {order.shipping.city}
          </div>
          <ChevronRight className="h-4 w-4 text-[#A31D1D]/30" />
        </div>
      </div>
    </div>
  );
}

export function OrderTracker({ orderId }: { orderId?: string }) {
  const { orders, getOrderById } = useCart();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.5, ease: "power2.out" }
      );
    }
  }, []);

  const order = orderId ? getOrderById(orderId) : undefined;
  const displayOrders = order ? [order] : orders;

  if (displayOrders.length === 0) {
    return (
      <div ref={containerRef} className="flex flex-col items-center justify-center py-20 text-center">
        <div className="h-20 w-20 rounded-full border-2 border-[#A31D1D]/20 flex items-center justify-center mb-4">
          <Package className="h-8 w-8 text-[#A31D1D]/30" strokeWidth={1.5} />
        </div>
        <h3 className="font-display font-bold text-xl uppercase tracking-widest text-[#A31D1D] mb-2">
          No Orders Yet
        </h3>
        <p className="text-sm text-[#A31D1D]/60 max-w-[300px]">
          Your order history is empty. Place an order to start tracking it here.
        </p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="flex flex-col gap-6">
      {displayOrders.map((o, i) => (
        <OrderCard key={o.id} order={o} index={i} />
      ))}
    </div>
  );
}

export default OrderTracker;
