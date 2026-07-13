import type { MusicData } from '@shared/types/MusicData';
import { MUSIC_MAP_COUNTRIES, MUSIC_MAP_ERAS } from '@shared/data/musicMapCountries';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui';

export default function MusicIntro({data}: { data: MusicData }) {
    const navigate = useNavigate();

    const toCountryCode = (name: string) =>
        String(name || '')
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '_')
            .replace(/^_+|_+$/g, '');

    const handleOpenCountryOnMap = (code: string, name: string) => {
        const params = new URLSearchParams();
        params.set('country', code);
        params.set('name', name);
        navigate(`/MusicMap?${params.toString()}`);
    };

    const countries = (data as any).countries;
    const getMapExamples = (name: string, code?: string) => {
        const lookup = String((code || name) || '').trim().toLowerCase().replace(/[^a-z0-9]+/g, '_');
        const found = (MUSIC_MAP_COUNTRIES as any).find((m: any) => {
            if (!m) return false;
            const codeKey = String(m.code || '').toLowerCase();
            const nameKey = String(m.name || '').toLowerCase();
            return codeKey === lookup || nameKey === lookup || nameKey.replace(/\s+/g, '_') === lookup;
        });

        if (!found) return null;

        // Flatten songs across eras, keep first 8 unique title-artist strings
        const examples: string[] = [];
        for (const era of MUSIC_MAP_ERAS) {
            const songs = (found.songs && (found.songs as any)[era]) || [];
            for (const s of songs) {
                if (s && s.title) examples.push(`${s.title} - ${s.artist || ''}`.trim());
            }
        }

        return Array.from(new Set(examples)).slice(0, 8);
    };

    return (
        <div>
            <main className="music-directory">
                <h2 className="page-title">{data.title}</h2>

                {countries && Array.isArray(countries) ? (
                    <div className="categories-grid">
                        {countries.map((c: any, index: number) => (
                            <section key={c.code || index} className="category">
                                <h3 className="category-title">
                                    <Button variant="link" onClick={() => handleOpenCountryOnMap(c.code, c.name)}>
                                        {c.name}
                                    </Button>
                                </h3>
                                <p className="category-description">{c.description}</p>
                                        {(() => {
                                            const mapExamples = getMapExamples(c.name, c.code);
                                            const displayExamples = mapExamples && mapExamples.length ? mapExamples : (c.examples || []);
                                            return displayExamples && displayExamples.length ? (
                                                <div className="example">
                                                    <h4 className="example-title">My Music Memos:</h4>
                                                    <div className="examples-list">
                                                        {displayExamples.map((ex: string, idx: number) => (
                                                            <p key={idx} className="example-text">{ex}</p>
                                                        ))}
                                                    </div>
                                                </div>
                                            ) : null;
                                        })()}
                                {c.examples && (
                                    <div className="example">
                                        <h4 className="example-title">My Music Memos:</h4>
                                        <div className="examples-list">
                                            {c.examples.map((ex: string, idx: number) => (
                                                <p key={idx} className="example-text">{ex}</p>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {c.tasks && (
                                    <div className="example">
                                        <h4 className="example-title">Listening Tasks:</h4>
                                        <div className="examples-list">
                                            {c.tasks.map((t: string, idx: number) => (
                                                <p key={idx} className="example-text">{t}</p>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </section>
                        ))}
                    </div>
                ) : (
                    <div className="categories-grid">
                        {data.categories.map((category, index) => (
                            <section key={index} className="category">
                                <h3 className="category-title">
                                    <Button variant="link" onClick={() => handleOpenCountryOnMap(toCountryCode(category.name), category.name)}>
                                        {category.name}
                                    </Button>
                                </h3>
                                <p className="category-description">{category.description}</p>
                                <div className="example">
                                    <h4 className="example-title">My Music Memos:</h4>

                                    <div className="examples-list">
                                        {category.examples.map((ex, idx) => (
                                            <p key={idx} className="example-text">{ex}
                                            </p>
                                        ))}
                                    </div>
                                </div>
                            </section>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
