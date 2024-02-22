import {
  DragDropContext,
  DragDropContextProps,
  Draggable,
  DraggableProps,
  DraggableProvidedDragHandleProps,
  Droppable,
  DroppableProps,
} from "@hello-pangea/dnd";
import { createContext, useContext, useEffect, useState } from "react";

interface DndRootProps extends DragDropContextProps {}

function DndRoot(props: DndRootProps) {
  return <DragDropContext {...props} />;
}

interface DndDroppableProps extends Omit<DroppableProps, "children"> {
  className?: string;
  children: React.ReactNode;
}

function DndDroppable({ className, children, ...props }: DndDroppableProps) {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    const animation = requestAnimationFrame(() => setEnabled(true));
    return () => {
      cancelAnimationFrame(animation);
      setEnabled(false);
    };
  }, []);
  if (!enabled) {
    return null;
  }

  return (
    <Droppable {...props}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className={className}
        >
          {children}
        </div>
      )}
    </Droppable>
  );
}

interface DndDraggableProps extends Omit<DraggableProps, "children"> {
  children: React.ReactNode;
  lock?: "horizontal" | "vertical";
  dragArea?: boolean;
}

const DragAreaContext = createContext<DraggableProvidedDragHandleProps | null>(
  null
);

function DndDraggable({
  children,
  lock,
  dragArea = true,
  ...props
}: DndDraggableProps) {
  return (
    <Draggable {...props}>
      {(provided, snapshot) => {
        let transform = provided.draggableProps.style?.transform;
        if (transform && snapshot.isDragging) {
          if (lock === "vertical")
            transform = transform.replace(/\(.+\,/, "(0,");
          if (lock === "horizontal")
            transform = transform.replace(/\,.+\)/, ",0)");
        }
        const style = {
          ...provided.draggableProps.style,
          transform,
        };
        const hasDragArea = dragArea ? { ...provided.dragHandleProps } : {};

        return (
          <DragAreaContext.Provider value={provided.dragHandleProps}>
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              style={style}
              {...hasDragArea}
            >
              {children}
            </div>
          </DragAreaContext.Provider>
        );
      }}
    </Draggable>
  );
}

interface DndDragAreaProps {
  children?: React.ReactNode;
}

function DndDragArea({ children }: DndDragAreaProps) {
  const provided = useContext(DragAreaContext);
  if (!provided) {
    throw new Error("Drag area must be used inside draggable.");
  }

  return <div {...provided}>{children}</div>;
}

export const Dnd = {
  Root: DndRoot,
  Droppable: DndDroppable,
  Draggable: DndDraggable,
  dragArea: DndDragArea,
};
