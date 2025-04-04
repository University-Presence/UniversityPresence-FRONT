"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import axios from 'axios';
import styles from '../../../styles/event.module.css';
import { Urbanist } from 'next/font/google';

const urbanist = Urbanist({ subsets: ['latin'] });

const EventShow: React.FC = () => {
    const { event_id } = useParams();
    const [event, setEvent] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const token = localStorage.getItem('authToken');
                const response = await axios.get(`http://localhost:3000/admin/events/${event_id}?include=course`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setEvent(response.data);
            } catch (err) {
                setError('Erro ao carregar detalhes do evento.');
            } finally {
                setLoading(false);
            }
        };

        fetchEvent();
    }, [event_id]);

    if (loading) {
        return <p>Carregando...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    const eventAttributes = event.data.attributes;
    const courseAttributes = event.included[0].attributes;

    return (
        <div className={`${styles.container} ${urbanist.className}`}>
            <h1 className={styles.title}>{eventAttributes.name}</h1>
            <p><strong>Data e Hora de Início:</strong> {new Date(eventAttributes.event_start).toLocaleString()}</p>
            <p><strong>Data e Hora de Fim:</strong> {new Date(eventAttributes.event_end).toLocaleString()}</p>
            <p><strong>Curso:</strong> {courseAttributes.name}</p>
            <p><strong>Períodos:</strong> {Array.from({ length: courseAttributes.periods }, (_, i) => i + 1).join(', ')} períodos</p>
            <p><strong>Local:</strong> {eventAttributes.location}</p>
            <p><strong>Descrição:</strong> {eventAttributes.description}</p>
            <button onClick={() => router.back()} className={styles.backButton}>Voltar</button>
        </div>
    );
};

export default EventShow;
