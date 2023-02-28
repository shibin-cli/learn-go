import{_ as s,c as n,o as a,a as l}from"./app.1597157c.js";const i=JSON.parse('{"title":"RPC","description":"","frontmatter":{},"headers":[{"level":2,"title":"什么是 RPC","slug":"什么是-rpc","link":"#什么是-rpc","children":[]},{"level":2,"title":"远程过程面临的问题","slug":"远程过程面临的问题","link":"#远程过程面临的问题","children":[]},{"level":2,"title":"快速体验 RPC","slug":"快速体验-rpc","link":"#快速体验-rpc","children":[]}],"relativePath":"base/rpc.md"}'),p={name:"base/rpc.md"},o=l(`<h1 id="rpc" tabindex="-1">RPC <a class="header-anchor" href="#rpc" aria-hidden="true">#</a></h1><h2 id="什么是-rpc" tabindex="-1">什么是 RPC <a class="header-anchor" href="#什么是-rpc" aria-hidden="true">#</a></h2><ul><li>RPC(Remote Procedure Call) 远程过程调用， 简单理解是一个节点请求另一个节点提供的服务</li><li>对应 RPC 的是本地过程调用，函数调用是最常见的本地过程调用</li><li>将本地过程变成远程过程调用会面临各种问题</li></ul><h2 id="远程过程面临的问题" tabindex="-1">远程过程面临的问题 <a class="header-anchor" href="#远程过程面临的问题" aria-hidden="true">#</a></h2><p>本地函数放到另一个服务器上去运行，但是会引入很多新问题</p><ul><li>Call 的 id 映射</li><li>序列化和反序列化</li><li>网络传输</li></ul><h2 id="快速体验-rpc" tabindex="-1">快速体验 RPC <a class="header-anchor" href="#快速体验-rpc" aria-hidden="true">#</a></h2><p>服务端</p><div class="language-go"><button title="Copy Code" class="copy"></button><span class="lang">go</span><pre class="shiki material-theme-palenight" tabindex="0"><code><span class="line"><span style="color:#89DDFF;">package</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">main</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89DDFF;">import</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">(</span></span>
<span class="line"><span style="color:#A6ACCD;">	</span><span style="color:#89DDFF;">&quot;</span><span style="color:#FFCB6B;">net</span><span style="color:#89DDFF;">&quot;</span></span>
<span class="line"><span style="color:#A6ACCD;">	</span><span style="color:#89DDFF;">&quot;</span><span style="color:#FFCB6B;">net/rpc</span><span style="color:#89DDFF;">&quot;</span></span>
<span class="line"><span style="color:#89DDFF;">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89DDFF;">type</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">HelloService</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">struct</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89DDFF;">func</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">s </span><span style="color:#89DDFF;">*</span><span style="color:#A6ACCD;">HelloService</span><span style="color:#89DDFF;">)</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">Hello</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">request </span><span style="color:#C792EA;">string</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> reply </span><span style="color:#89DDFF;">*</span><span style="color:#C792EA;">string</span><span style="color:#89DDFF;">)</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">error</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">	</span><span style="color:#89DDFF;">*</span><span style="color:#A6ACCD;">reply </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">Hello,</span><span style="color:#89DDFF;">&quot;</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">+</span><span style="color:#A6ACCD;"> request</span></span>
<span class="line"><span style="color:#A6ACCD;">	</span><span style="color:#89DDFF;font-style:italic;">return</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">nil</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#89DDFF;">func</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">main</span><span style="color:#89DDFF;">()</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">	</span><span style="color:#676E95;font-style:italic;">// 注册一个 server</span></span>
<span class="line"><span style="color:#A6ACCD;">	listener</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> _ </span><span style="color:#89DDFF;">:=</span><span style="color:#A6ACCD;"> net</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">Listen</span><span style="color:#89DDFF;">(</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">tcp</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">:8080</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">)</span></span>
<span class="line"><span style="color:#A6ACCD;">	</span><span style="color:#676E95;font-style:italic;">// 注册处理逻辑</span></span>
<span class="line"><span style="color:#A6ACCD;">	err </span><span style="color:#89DDFF;">:=</span><span style="color:#A6ACCD;"> rpc</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">RegisterName</span><span style="color:#89DDFF;">(</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">HelloService</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&amp;</span><span style="color:#A6ACCD;">HelloService</span><span style="color:#89DDFF;">{})</span></span>
<span class="line"><span style="color:#A6ACCD;">	</span><span style="color:#89DDFF;font-style:italic;">if</span><span style="color:#A6ACCD;"> err </span><span style="color:#89DDFF;">!=</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">nil</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">		</span><span style="color:#89DDFF;font-style:italic;">return</span></span>
<span class="line"><span style="color:#A6ACCD;">	</span><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#A6ACCD;">	</span><span style="color:#676E95;font-style:italic;">// 启动服务</span></span>
<span class="line"><span style="color:#A6ACCD;">	conn</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> _ </span><span style="color:#89DDFF;">:=</span><span style="color:#A6ACCD;"> listener</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">Accept</span><span style="color:#89DDFF;">()</span></span>
<span class="line"><span style="color:#A6ACCD;">	rpc</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">ServeConn</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">conn</span><span style="color:#89DDFF;">)</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"></span></code></pre></div><p>客户端</p><div class="language-go"><button title="Copy Code" class="copy"></button><span class="lang">go</span><pre class="shiki material-theme-palenight" tabindex="0"><code><span class="line"><span style="color:#89DDFF;">package</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">main</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89DDFF;">import</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">(</span></span>
<span class="line"><span style="color:#A6ACCD;">	</span><span style="color:#89DDFF;">&quot;</span><span style="color:#FFCB6B;">fmt</span><span style="color:#89DDFF;">&quot;</span></span>
<span class="line"><span style="color:#A6ACCD;">	</span><span style="color:#89DDFF;">&quot;</span><span style="color:#FFCB6B;">net/rpc</span><span style="color:#89DDFF;">&quot;</span></span>
<span class="line"><span style="color:#89DDFF;">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89DDFF;">func</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">main</span><span style="color:#89DDFF;">()</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">	client</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> err </span><span style="color:#89DDFF;">:=</span><span style="color:#A6ACCD;"> rpc</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">Dial</span><span style="color:#89DDFF;">(</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">tcp</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">localhost:8080</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">)</span></span>
<span class="line"><span style="color:#A6ACCD;">	</span><span style="color:#89DDFF;font-style:italic;">if</span><span style="color:#A6ACCD;"> err </span><span style="color:#89DDFF;">!=</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">nil</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">		</span><span style="color:#82AAFF;">panic</span><span style="color:#89DDFF;">(</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">连接失败</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">)</span></span>
<span class="line"><span style="color:#A6ACCD;">	</span><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#A6ACCD;">	</span><span style="color:#89DDFF;">var</span><span style="color:#A6ACCD;"> reply </span><span style="color:#89DDFF;">*</span><span style="color:#C792EA;">string</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">new</span><span style="color:#89DDFF;">(</span><span style="color:#C792EA;">string</span><span style="color:#89DDFF;">)</span></span>
<span class="line"><span style="color:#A6ACCD;">	err </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> client</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">Call</span><span style="color:#89DDFF;">(</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">HelloService.Hello</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">Shibin</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> reply</span><span style="color:#89DDFF;">)</span></span>
<span class="line"><span style="color:#A6ACCD;">	</span><span style="color:#89DDFF;font-style:italic;">if</span><span style="color:#A6ACCD;"> err </span><span style="color:#89DDFF;">!=</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">nil</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">		</span><span style="color:#82AAFF;">panic</span><span style="color:#89DDFF;">(</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">调用失败</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">)</span></span>
<span class="line"><span style="color:#A6ACCD;">	</span><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#A6ACCD;">	fmt</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">Println</span><span style="color:#89DDFF;">(*</span><span style="color:#A6ACCD;">reply</span><span style="color:#89DDFF;">)</span><span style="color:#A6ACCD;"> </span><span style="color:#676E95;font-style:italic;">// Hello,Shibin</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"></span></code></pre></div>`,11),e=[o];function t(c,r,D,F,y,C){return a(),n("div",null,e)}const u=s(p,[["render",t]]);export{i as __pageData,u as default};
