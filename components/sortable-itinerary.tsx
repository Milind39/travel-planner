"use client";

import { Location } from "@/app/generated/prisma";
import { reorderItinerary } from "@/lib/actions/reorder-itineraty";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";
import {
  DndContext,
  closestCenter,
  DragEndEvent,
  DragOverlay,
  useSensor,
  useSensors,
  PointerSensor,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useId, useState, memo } from "react";
import { motion } from "framer-motion";
import { ChevronDown, ChevronUp, GripVertical, MapPin } from "lucide-react";
import { createPortal } from "react-dom";

interface SortableItineraryProps {
  locations: Location[];
  tripId: string;
}

const SortableItem = memo(({ item }: { item: Location }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const [showDescription, setShowDescription] = useState(false);

  const toggleDescription = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDescription((prev) => !prev);
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      {...attributes}
      {...listeners}
      className={`
        container overflow-hidden rounded-xl bg-indigo-500 backdrop-blur-sm
        border border-gray-300 shadow-sm hover:shadow-md
        transition-all duration-300 cursor-grab active:cursor-grabbing
        ${
          isDragging
            ? "opacity-75 scale-[0.98] shadow-lg ring-2 ring-indigo-400"
            : ""
        }
        ${showDescription ? "pb-6" : "pb-0"}
      `}
    >
      {/* Main Content */}
      <div className="p-5">
        <div className="flex justify-between items-center">
          {/* Left side: Grip, Title, and Toggle Button */}
          <div className="flex items-center gap-3 flex-1">
            <GripVertical className="text-foreground w-5 h-5 flex-shrink-0" />

            <div className="flex items-center gap-3 flex-1">
              <h4 className="font-semibold text-lg text-foreground truncate">
                {item.locationTitle}
              </h4>

              <button
                onClick={toggleDescription}
                className="
                  flex items-center justify-center w-8 h-8 rounded-lg
                  bg-indigo-300/50 hover:bg-indigo-300
                  border border-gray-400 transition-all duration-200
                  hover:scale-105 active:scale-95
                "
                aria-label={
                  showDescription ? "Hide description" : "Show description"
                }
              >
                {showDescription ? (
                  <ChevronUp className="w-4 h-4 text-foreground" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-foreground" />
                )}
              </button>
            </div>
          </div>
          {/* Right side: Day number */}
          <div className="flex items-center gap-2 ml-4">
            <span className="text-sm text-foreground font-medium">Day</span>
            <span className="text-2xl font-bold text-foreground bg-indigo-300/30 px-3 py-1 rounded-lg">
              {item.order}
            </span>
          </div>
        </div>
      </div>

      {/* Expandable Description */}
      <motion.div
        initial={false}
        animate={{
          height: showDescription ? "auto" : 0,
          opacity: showDescription ? 1 : 0,
        }}
        transition={{ duration: 0.15, ease: "easeInOut" }}
        className="overflow-hidden px-5 pb-4"
      >
        <div className="border-t pt-3">
          <ul className="space-y-2">
            {item.description
              .split(". ")
              .filter(Boolean)
              .map((sentence, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 text-sm text-foreground"
                >
                  <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                  <span className="leading-relaxed">
                    {sentence.trim()}
                    {sentence.includes(".") ? "" : "."}
                  </span>
                </li>
              ))}
          </ul>
        </div>
      </motion.div>
    </motion.div>
  );
});

export default function SortableItinerary({
  locations,
  tripId,
}: SortableItineraryProps) {
  const id = useId();
  const [localLocation, setLocalLocation] = useState(locations);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    if (active.id !== over.id) {
      const oldIndex = localLocation.findIndex((item) => item.id === active.id);
      const newIndex = localLocation.findIndex((item) => item.id === over.id);

      const newLocationsOrder = arrayMove(
        localLocation,
        oldIndex,
        newIndex
      ).map((item, index) => ({ ...item, order: index }));

      setLocalLocation(newLocationsOrder);

      await reorderItinerary(
        tripId,
        newLocationsOrder.map((item) => item.id)
      );
    }
    setActiveId(null);
  };

  return (
    <div className="max-w-full">
      {" "}
      {/* Header */}
      <DndContext
        id={id}
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={({ active }) => setActiveId(active.id as string)}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToWindowEdges]}
      >
        <SortableContext
          items={localLocation.map((loc) => loc.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-4">
            {localLocation.map((item) => (
              <SortableItem key={item.id} item={item} />
            ))}
          </div>
        </SortableContext>

        {createPortal(
          <DragOverlay>
            {activeId && (
              <motion.div className="p-4 rounded-md flex justify-between items-center bg-indigo-600 shadow-2xl text-foreground">
                <div className="flex items-center gap-3">
                  <GripVertical className="text-foreground/70" />
                  <div>
                    <h4 className="font-semibold text-xl">
                      {
                        localLocation.find((i) => i.id === activeId)
                          ?.locationTitle
                      }
                    </h4>
                    <p className="text-sm">{`Latitude: ${
                      localLocation.find((i) => i.id === activeId)?.lat
                    }, Longitude: ${
                      localLocation.find((i) => i.id === activeId)?.lng
                    }`}</p>
                  </div>
                </div>
                <div className="text-sm">
                  Day{" "}
                  <span className="font-semibold text-2xl">
                    {localLocation.find((i) => i.id === activeId)?.order}
                  </span>
                </div>
              </motion.div>
            )}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
    </div>
  );
}
