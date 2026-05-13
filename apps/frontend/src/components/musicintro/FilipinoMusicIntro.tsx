import type { MusicData } from '@shared/types/MusicData';

export default function FilipinoMusicIntro({data}: { data: MusicData }) {
    return (
        <div>
            <main className="filipino-music-directory">
                <h2 className="page-title">{data.title}</h2>
                <div className="categories-grid">
                        {data.categories.map((category, index) => (
                            <section key={index} className="category">
                            <h3 className="category-title">{category.name}</h3>
                            <p className="category-description">{category.description}</p>
                            <div className="example">
                                <h4 className="example-title">Examples:</h4>
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
            </main>
        </div>
    );
}   