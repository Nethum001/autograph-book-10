'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

type Entry = { id: string; name: string; message: string; created_at: string };
export default function Home() {
  const [name,setName] = useState('');
  const [message,setMessage] = useState('');
  const [entries,setEntries] = useState<Entry[]>([]);
  const [status,setStatus] = useState('');
  const [loading,setLoading] = useState(false);

  async function loadEntries() {
    try {
      const { data, error } = await supabase().from('autographs')
        .select('id,name,message,created_at').eq('status','approved')
        .order('created_at',{ascending:false});
      if (error) throw error;
      setEntries(data || []);
    } catch { setStatus('Could not load the guestbook. Check the database setup.'); }
  }
  useEffect(() => { loadEntries(); }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !message.trim()) { setStatus('Please add your name and a message.'); return; }
    setLoading(true); setStatus('');
    try {
      const { error } = await supabase().from('autographs').insert({
        name: name.trim().slice(0,60), message: message.trim().slice(0,500), status:'pending'
      });
      if (error) throw error;
      setName(''); setMessage('');
      setStatus('Thank you! Your autograph was sent for approval.');
    } catch { setStatus('Sorry, your autograph could not be submitted. Please try again.'); }
    finally { setLoading(false); }
  }

  return <main>
    <nav className="nav"><a className="brand" href="#">✦ Autograph Book<span>'10</span></a><a href="#guestbook">Read messages ↗</a></nav>
    <section className="hero">
      <div className="hero-copy">
        <div className="eyebrow">✧ &nbsp; A LITTLE SPACE FOR YOUR WORDS &nbsp; ✧</div>
        <h1>Leave a little note.<br/><em>Make a lasting memory.</em></h1>
        <p>Every name has a story. Every message becomes a memory.<br/>Add your words to our little book.</p>
        <a className="cta" href="#write">Write an autograph <span>↓</span></a>
        <div className="scribble">with love, always ✍</div>
      </div>
      <div className="hero-visual" role="img" aria-label="A beautiful journal, flowers and a handwritten note">
        <div className="visual-tag">little words, big memories ♡</div>
      </div>
      <span className="floating-flower flower-a">✿</span>
      <span className="floating-flower flower-b">✧</span>
      <span className="floating-flower flower-c">♡</span>
    </section>
    <section className="write section" id="write">
      <div className="section-kicker">01 / YOUR PAGE</div><h2>Make your mark.</h2>
      <p className="muted">Write something kind, funny, thoughtful, or simply say hello.</p>
      <form onSubmit={submit}>
        <label>Your name<input value={name} onChange={e=>setName(e.target.value)} maxLength={60} placeholder="What should we call you?" /></label>
        <label>Your autograph<textarea value={message} onChange={e=>setMessage(e.target.value)} maxLength={500} rows={5} placeholder="Write your message here..." /></label>
        <div className="form-foot"><small>Up to 500 characters · Your message appears after approval</small><button disabled={loading}>{loading ? 'Sending…' : 'Submit for approval ↗'}</button></div>
      </form>
      {status && <div className="status" role="status">{status}</div>}
    </section>
    <section className="guest section" id="guestbook">
      <div className="section-kicker">02 / THE GUESTBOOK</div><div className="guest-head"><div><h2>Words to keep.</h2><p className="muted">Little notes from lovely people.</p></div><div className="count">{entries.length.toString().padStart(2,'0')}<small>APPROVED NOTES</small></div></div>
      {entries.length ? <div className="grid">{entries.map((entry,i)=><article className="note" key={entry.id}><div className="note-top"><span>✦ &nbsp; A NOTE TO REMEMBER</span><span>#{String(entries.length-i).padStart(2,'0')}</span></div><p>{entry.message}</p><div className="signature">— {entry.name}</div><time>{new Date(entry.created_at).toLocaleDateString(undefined,{year:'numeric',month:'long',day:'numeric'})}</time></article>)}</div> : <div className="empty">The pages are waiting for their first memories. <span>Be the first to write one.</span></div>}
      <button className="refresh" onClick={loadEntries}>Refresh the pages ↻</button>
    </section>
    <footer><span>Autograph Book'10</span><a className="contact-link" href="https://nethum001.github.io/about/" target="_blank" rel="noopener noreferrer">Contact me ↗</a><span className="credit">Made with <i aria-label="love">♥</i> by <strong>Nethum</strong></span></footer>
  </main>;
}
