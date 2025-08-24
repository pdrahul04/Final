import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import type { TaskStatus } from '../../types';

interface DroppableColumnProps {
  status: TaskStatus;
  title: string;
  color: string;
  children: React.ReactNode;
}

const DroppableColumn: React.FC<DroppableColumnProps> = ({
  status,
  title,
  color,
  children
}) => {
  const { isOver, setNodeRef } = useDroppable({
    id: status,
    data: {
      type: 'column',
      status: status,
    },
  });

  return (
    <div 
      ref={setNodeRef}
      className={`board-column ${isOver ? 'drag-over' : ''}`}
    >
      <div className="column-header" style={{ borderTopColor: color }}>
        <h3>{title}</h3>
      </div>
      <div className="column-content">
        {children}
      </div>
    </div>
  );
};

export default DroppableColumn;