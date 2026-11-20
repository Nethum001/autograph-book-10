'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
type Entry={id:string;name:string;message:string;created_at:string};
export default function Admin(){
 const [items,setItems]=useState<Entry[]>([]); const [email,setEmail]=useState(''); const [password,setPassword]=useState(''); const [user,setUser]=useState(''); const [note,setNote]=useState('');
 async function refresh(){const {data}=await supabase().from('autographs').select('*').eq('status','pending').order('created_at');setItems(data||[]);}
 useEffect(()=>{supabase().auth.getUser().then(({data})=>{setUser(data.user?.email||'');if(data.user)refresh();});},[]);
 async function login(e:React.FormEvent){e.preventDefault();const {error}=await supabase().auth.signInWithPassword({email,password});if(error){setNote(error.message);return;}setUser(email);refresh();}
 async function action(id:string,status:'approved'|'rejected'){const {error}=await supabase().from('autographs').update({status}).eq('id',id);if(error){setNote(error.message);return;}setNote(status==='approved'?'Autograph approved.':'Autograph rejected.');refresh();}
 async function logout(){await supabase().auth.signOut();setUser('');}
 return <main className="admin"><a href="/" className="back">← Back to the book</a><div className="section-kicker">PRIVATE ADMIN</div><h1>Review the pages.</h1>{!user?<form onSubmit={login} className="login"><label>Admin email<input type="email" value={email} onChange={e=>setEmail(e.target.value)} required/></label><label>Password<input type="password" value={password} onChange={e=>setPassword(e.target.value)} required/></label><button>Sign in ↗</button></form>:<><p>Signed in as {user} <button className="plain" onClick={logout}>Sign out</button></p><h2>Waiting for approval ({items.length})</h2>{items.map(x=><article className="pending" key={x.id}><strong>{x.name}</strong><p>{x.message}</p><button onClick={()=>action(x.id,'approved')}>Approve</button><button className="reject" onClick={()=>action(x.id,'rejected')}>Reject</button></article>)}{!items.length&&<p>No messages waiting right now.</p>}</>}{note&&<p className="status">{note}</p>}</main>
}
