"use client";

import React, { useState, useEffect } from 'react';
import styles from '../../../styles/eventForm.module.css';
import { useRouter } from 'next/navigation';

const CreateEventPage: React.FC = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        event_start: '',
        event_end: '',
        course_id: '',
        location: '',
        class_room_ids: '',
    });
    const [courses, setCourses] = useState<{ id: string; attributes: { name: string } }[]>([]);
    const [classRooms, setClassRooms] = useState<{ id: string; attributes: { name: string } }[]>([]);

    useEffect(() => {
        const fetchCourses = async () => {
            const token = localStorage.getItem('authToken');
            try {
                const response = await fetch('http://localhost:3000/admin/courses', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (response.ok) {
                    const data = await response.json();
                    setCourses(data.data);
                }
            } catch (error) {
                console.error('Erro ao buscar cursos:', error);
            }
        };
        fetchCourses();
    }, []);

    const handleCourseChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const courseId = e.target.value;
        setFormData({ ...formData, course_id: courseId });

        const token = localStorage.getItem('authToken');
        try {
            const response = await fetch(`http://localhost:3000/admin/courses/${courseId}/class_rooms`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.ok) {
                const data = await response.json();
                setClassRooms(data.data);
            }
        } catch (error) {
            console.error('Erro ao buscar turmas:', error);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem('authToken');
        const payload = {
            data: {
                type: 'event',
                attributes: {
                    ...formData,
                    class_room_ids: formData.class_room_ids.split(',').map(id => id.trim()),
                },
            },
        };

        try {
            const response = await fetch('http://localhost:3000/admin/event', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                router.push('/admin/event');
            } else {
                alert('Erro ao criar evento.');
            }
        } catch (error) {
            console.error('Erro ao criar evento:', error);
        }
    };

    return (
        <div className={styles.container}>
            <form onSubmit={handleSubmit} className={styles.form}>
                <h2 className={styles.title}>Criar Evento</h2>
                <div className={styles.inputGroup}>
                    <label htmlFor="name">Nome:</label>
                    <input
                        id="name"
                        type="text"
                        name="name"
                        placeholder="Nome do evento"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className={styles.inputGroup}>
                    <label htmlFor="description">Descrição:</label>
                    <textarea
                        id="description"
                        name="description"
                        placeholder="Descrição"
                        value={formData.description}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className={styles.inputGroup}>
                    <label htmlFor="event_start">Data e hora inicial:</label>
                    <input
                        id="event_start"
                        type="datetime-local"
                        name="event_start"
                        value={formData.event_start}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className={styles.inputGroup}>
                    <label htmlFor="event_end">Data e hora final:</label>
                    <input
                        id="event_end"
                        type="datetime-local"
                        name="event_end"
                        value={formData.event_end}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className={styles.inputGroup}>
                    <label htmlFor="location">Local:</label>
                    <input
                        id="location"
                        type="text"
                        name="location"
                        placeholder="Localização"
                        value={formData.location}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className={styles.inputGroup}>
                    <label htmlFor="course_id">Curso:</label>
                    <select
                        id="course_id"
                        name="course_id"
                        value={formData.course_id}
                        onChange={handleCourseChange}
                        required
                    >
                        <option value="">Selecione um curso</option>
                        {courses.map(course => (
                            <option key={course.id} value={course.id}>
                                {course.attributes.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className={styles.inputGroup}>
                    <label htmlFor="class_room_ids">Turmas:</label>
                    <select
                        id="class_room_ids"
                        name="class_room_ids"
                        value={formData.class_room_ids}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Selecione uma turma</option>
                        {classRooms.map(classRoom => (
                            <option key={classRoom.id} value={classRoom.id}>
                                {classRoom.attributes.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className={styles.buttonContainer}>
                    <button type="button" className={styles.cancelButton} onClick={() => router.push('/admin/event')}>
                        Cancelar
                    </button>
                    <button type="submit" className={styles.submitButton}>
                        Criar Evento
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateEventPage;
