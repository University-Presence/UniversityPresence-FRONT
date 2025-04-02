import React from 'react';
import styles from '../styles/eventItem.module.css';

interface EventItemProps {
    id: string;
    name: string;
    description: string;
    location: string;
    eventStart: string;
    eventEnd: string;
    onViewDetails: (id: string) => void;
}

const EventItem: React.FC<EventItemProps> = ({ id, name, description, location, eventStart, eventEnd, onViewDetails }) => {
    return (
        <div className={styles.card}>
            <h2 className={styles.title}>{name}</h2>
            <p className={styles.description}>{description}</p>
            <p className={styles.location}><strong>Local:</strong> {location}</p>
            <p className={styles.datetime}>
                <strong>Data e Hora:</strong> {new Date(eventStart).toLocaleString()} - {new Date(eventEnd).toLocaleString()}
            </p>
            <button className={styles.button} onClick={() => onViewDetails(id)}>
                Ver Detalhes
            </button>
        </div>
    );
};

export default EventItem;
