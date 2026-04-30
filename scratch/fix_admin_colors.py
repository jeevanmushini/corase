import re

with open("corase/src/app/admin/page.tsx", "r") as f:
    content = f.read()

# Make the replacements
replacements = {
    "bg-[#050505]": "bg-background",
    "bg-[#0a0a0a]": "bg-background",
    "text-white": "text-foreground",
    "border-white/10": "border-foreground/10",
    "border-white/5": "border-foreground/5",
    "border-white/20": "border-foreground/20",
    "bg-white/5": "bg-foreground/5",
    "bg-white/10": "bg-foreground/10",
    "bg-white/20": "bg-foreground/20",
    "bg-white/[0.03]": "bg-foreground/[0.03]",
    "bg-white/[0.02]": "bg-foreground/[0.02]",
    "text-white/20": "text-foreground/20",
    "text-white/30": "text-foreground/30",
    "text-white/40": "text-foreground/40",
    "text-white/50": "text-foreground/50",
    "text-white/60": "text-foreground/60",
    "text-white/70": "text-foreground/70",
    "text-white/80": "text-foreground/80",
    "text-white/90": "text-foreground/90",
    "hover:text-white": "hover:text-foreground",
    "bg-white": "bg-foreground",
    "text-black": "text-background",
    "bg-black": "bg-background",
    "border-black": "border-background",
    "border-white/30": "border-foreground/30",
    "border-white/40": "border-foreground/40"
}

for old, new in replacements.items():
    content = content.replace(old, new)

# We also need to add the Users tab. Let's do that through regex.
# Add to NAV
if "tab: 'customers'" not in content:
    nav_match = re.search(r"const NAV = \[\s*\{[^\}]+\},\s*\{[^\}]+\},\s*\{[^\}]+\},\s*\{[^\}]+\},\s*\] as const;", content)
    if nav_match:
        nav_str = nav_match.group(0).replace("] as const;", "    { icon: Users,           label: 'Customers', tab: 'customers' },\n] as const;")
        content = content.replace(nav_match.group(0), nav_str)
    
# Add users state
if "const [users, setUsers] = useState<any[]>([])" not in content:
    content = content.replace("const [settings, setSettings] = useState<any>(null);", "const [settings, setSettings] = useState<any>(null);\n    const [users, setUsers] = useState<any[]>([]);")

# Add to fetch
fetch_old = """const [pRes, oRes, sRes] = await Promise.all([
                    fetch("/api/products"),
                    fetch("/api/admin/orders"),
                    fetch("/api/admin/settings")
                ]);"""
fetch_new = """const [pRes, oRes, sRes, uRes] = await Promise.all([
                    fetch("/api/products"),
                    fetch("/api/admin/orders"),
                    fetch("/api/admin/settings"),
                    fetch("/api/admin/users")
                ]);"""
content = content.replace(fetch_old, fetch_new)

parse_old = """const pData = await pRes.json();
                const oData = await oRes.json();
                const sData = await sRes.json();
                
                setProducts(pData);
                setOrders(oData);
                setSettings(sData);"""
parse_new = """const pData = await pRes.json();
                const oData = await oRes.json();
                const sData = await sRes.json();
                const uData = await uRes.json();
                
                setProducts(pData);
                setOrders(oData);
                setSettings(sData);
                setUsers(uData);"""
content = content.replace(parse_old, parse_new)

# Add customers tab rendering block at the end of <main> before </main>
customers_html = '''
                    {tab === 'customers' && (
                        <div className="bg-foreground/5 border border-foreground/10 rounded-2xl overflow-hidden">
                            <div className="px-8 py-6 border-b border-foreground/5 flex items-center justify-between">
                                <h3 className="text-sm font-black font-syncopate uppercase">Customers</h3>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[800px]">
                                    <thead>
                                        <tr className="border-b border-foreground/5">
                                            {['Customer', 'Email', 'Role', 'Wishlist Items', 'Joined'].map(h => (
                                                <th key={h} className="text-left px-8 py-5 text-[10px] font-black text-foreground/30 uppercase tracking-[0.2em]">{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-foreground/5">
                                        {users.map(u => (
                                            <tr key={u._id} className="hover:bg-foreground/[0.02] transition-colors group cursor-pointer">
                                                <td className="px-8 py-5 text-xs font-bold text-foreground uppercase">{u.name}</td>
                                                <td className="px-8 py-5 text-[10px] text-foreground/60 uppercase">{u.email}</td>
                                                <td className="px-8 py-5">
                                                    <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${
                                                        u.role === 'admin' ? 'bg-purple-500/10 text-purple-400' : 'bg-blue-500/10 text-blue-400'
                                                    }`}>
                                                        {u.role}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-5 text-xs font-black text-foreground">
                                                    <div className="flex -space-x-2">
                                                        {u.wishlist?.slice(0, 3).map((item: any, idx: number) => (
                                                            <div key={idx} className="w-8 h-10 rounded border border-background bg-[#111] overflow-hidden" title={item.name}>
                                                                <img src={item.image} className="w-full h-full object-cover" />
                                                            </div>
                                                        ))}
                                                        {u.wishlist?.length > 3 && (
                                                            <div className="w-8 h-10 rounded border border-background bg-foreground/10 flex items-center justify-center text-[9px] font-black text-foreground">
                                                                +{u.wishlist.length - 3}
                                                            </div>
                                                        )}
                                                        {(!u.wishlist || u.wishlist.length === 0) && <span className="text-foreground/30 font-bold uppercase tracking-widest text-[10px]">Empty</span>}
                                                    </div>
                                                </td>
                                                <td className="px-8 py-5 text-[10px] text-foreground/60 font-bold uppercase">{new Date(u.createdAt).toLocaleDateString('en-GB')}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
'''
if "tab === 'customers'" not in content:
    content = content.replace("</main>", customers_html + "                </main>")

with open("corase/src/app/admin/page.tsx", "w") as f:
    f.write(content)

print("Done")
