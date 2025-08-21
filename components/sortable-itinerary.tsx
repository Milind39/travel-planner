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
import { useId, useState } from "react";
import { motion } from "framer-motion";
import { GripVertical } from "lucide-react";
import { createPortal } from "react-dom";

interface SortableItineraryProps {
  locations: Location[];
  tripId: string;
}

function SortableItem({ item }: { item: Location }) {
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

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: -10 }}
      exit={{ opacity: 0, y: -10 }}
      {...attributes}
      {...listeners}
      className={`p-4 rounded-md flex justify-between items-center bg-indigo-400/80 backdrop-blur transition-all shadow-md hover:shadow-xl hover:border-2 hover:border-indigo-800 cursor-grab ${
        isDragging ? "opacity-50 scale-105 ring-2 ring-indigo-500" : ""
      }`}
    >
      <div className="flex items-center gap-3">
        <GripVertical className="text-black/60" />
        <div>
          <h4 className="font-semibold text-xl">{item.locationTitle}</h4>
          <p className="text-sm text-black truncate max-w-xs">
            {`Latitude: ${item.lat}, Longitude: ${item.lng}`}
          </p>
        </div>
      </div>
      <div className="text-sm">
        Day <span className="font-semibold text-2xl">{item.order}</span>
      </div>
    </motion.div>
  );
}

export default function SortableItinerary({
  locations,
  tripId,
}: SortableItineraryProps) {
  const id = useId();
  const [localLocation, setLocalLocation] = useState(locations);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
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
    <DndContext
      id={id}
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={({ active }) => setActiveId(active.id as string)}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={localLocation.map((loc) => loc.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-3">
          {localLocation.map((item) => (
            <SortableItem key={item.id} item={item} />
          ))}
        </div>
      </SortableContext>

      {createPortal(
        <DragOverlay modifiers={[restrictToWindowEdges]}>
          {activeId ? (
            <motion.div
              layout
              className="p-4 rounded-md flex justify-between items-center bg-indigo-600 shadow-2xl text-white"
            >
              <div className="flex items-center gap-3">
                <GripVertical className="text-white/70" />
                <div>
                  <h4 className="font-semibold text-xl">
                    {
                      localLocation.find((i) => i.id === activeId)
                        ?.locationTitle
                    }
                  </h4>
                  <p className="text-sm">
                    {`Latitude: ${
                      localLocation.find((i) => i.id === activeId)?.lat
                    }, Longitude: ${
                      localLocation.find((i) => i.id === activeId)?.lng
                    }`}
                  </p>
                </div>
              </div>
              <div className="text-sm">
                Day{" "}
                <span className="font-semibold text-2xl">
                  {localLocation.find((i) => i.id === activeId)?.order}
                </span>
              </div>
            </motion.div>
          ) : null}
        </DragOverlay>,
        document.body
      )}
    </DndContext>
  );
}
