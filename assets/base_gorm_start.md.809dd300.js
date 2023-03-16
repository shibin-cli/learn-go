import{_ as s,c as a,o as n,Q as l}from"./chunks/framework.695d4026.js";const i=JSON.parse('{"title":"GORM","description":"","frontmatter":{},"headers":[],"relativePath":"base/gorm/start.md"}'),p={name:"base/gorm/start.md"},o=l(`<h1 id="gorm" tabindex="-1">GORM <a class="header-anchor" href="#gorm" aria-label="Permalink to &quot;GORM&quot;">​</a></h1><p><a href="https://gorm.io/" target="_blank" rel="noreferrer">GORM</a> 文档地址 <a href="https://gorm.io/zh_CN/docs/" target="_blank" rel="noreferrer">https://gorm.io/zh_CN/docs/</a></p><h2 id="安装" tabindex="-1">安装 <a class="header-anchor" href="#安装" aria-label="Permalink to &quot;安装&quot;">​</a></h2><div class="language-bash"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#FFCB6B;">go</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">get</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">-u</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">gorm.io/gorm</span></span>
<span class="line"><span style="color:#FFCB6B;">go</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">get</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">-u</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">gorm.io/driver/mysql</span></span>
<span class="line"></span></code></pre></div><h2 id="连接数据库" tabindex="-1">连接数据库 <a class="header-anchor" href="#连接数据库" aria-label="Permalink to &quot;连接数据库&quot;">​</a></h2><div class="language-go"><button title="Copy Code" class="copy"></button><span class="lang">go</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#89DDFF;">import</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">(</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#89DDFF;">&quot;</span><span style="color:#FFCB6B;">gorm.io/driver/mysql</span><span style="color:#89DDFF;">&quot;</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#89DDFF;">&quot;</span><span style="color:#FFCB6B;">gorm.io/gorm</span><span style="color:#89DDFF;">&quot;</span></span>
<span class="line"><span style="color:#89DDFF;">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89DDFF;">func</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">main</span><span style="color:#89DDFF;">()</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#676E95;font-style:italic;">// 参考 https://github.com/go-sql-driver/mysql#dsn-data-source-name 获取详情</span></span>
<span class="line"><span style="color:#A6ACCD;">  dsn </span><span style="color:#89DDFF;">:=</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">user:pass@tcp(127.0.0.1:3306)/dbname?charset=utf8mb4&amp;parseTime=True&amp;loc=Local</span><span style="color:#89DDFF;">&quot;</span></span>
<span class="line"><span style="color:#A6ACCD;">  db</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> err </span><span style="color:#89DDFF;">:=</span><span style="color:#A6ACCD;"> gorm</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">Open</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">mysql</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">Open</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">dsn</span><span style="color:#89DDFF;">),</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&amp;</span><span style="color:#A6ACCD;">gorm</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">Config</span><span style="color:#89DDFF;">{})</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"></span></code></pre></div><p>下面是 dsn 的格式，具体详情可以参考<a href="https://github.com/go-sql-driver/mysql#dsn-data-source-name" target="_blank" rel="noreferrer">这里</a></p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#A6ACCD;">[username[:password]@][protocol[(address)]]/dbname[?param1=value1&amp;...&amp;paramN=valueN]</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><h2 id="快速入门" tabindex="-1">快速入门 <a class="header-anchor" href="#快速入门" aria-label="Permalink to &quot;快速入门&quot;">​</a></h2><div class="language-go"><button title="Copy Code" class="copy"></button><span class="lang">go</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#89DDFF;">package</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">main</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89DDFF;">import</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">(</span></span>
<span class="line"><span style="color:#A6ACCD;">	</span><span style="color:#89DDFF;">&quot;</span><span style="color:#FFCB6B;">gorm.io/driver/mysql</span><span style="color:#89DDFF;">&quot;</span></span>
<span class="line"><span style="color:#A6ACCD;">	</span><span style="color:#89DDFF;">&quot;</span><span style="color:#FFCB6B;">gorm.io/gorm</span><span style="color:#89DDFF;">&quot;</span></span>
<span class="line"><span style="color:#89DDFF;">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89DDFF;">type</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">User</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">struct</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">	gorm</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">Model</span></span>
<span class="line"><span style="color:#A6ACCD;">	Name </span><span style="color:#C792EA;">string</span></span>
<span class="line"><span style="color:#A6ACCD;">	Age  </span><span style="color:#C792EA;">uint8</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89DDFF;">func</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">main</span><span style="color:#89DDFF;">()</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">	dsn </span><span style="color:#89DDFF;">:=</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">user:pass@tcp(127.0.0.1:3306)/test?charset=utf8mb4&amp;parseTime=True&amp;loc=Local</span><span style="color:#89DDFF;">&quot;</span></span>
<span class="line"><span style="color:#A6ACCD;">	db</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> err </span><span style="color:#89DDFF;">:=</span><span style="color:#A6ACCD;"> gorm</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">Open</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">mysql</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">Open</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">dsn</span><span style="color:#89DDFF;">),</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&amp;</span><span style="color:#A6ACCD;">gorm</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">Config</span><span style="color:#89DDFF;">{})</span></span>
<span class="line"><span style="color:#A6ACCD;">	</span><span style="color:#89DDFF;font-style:italic;">if</span><span style="color:#A6ACCD;"> err </span><span style="color:#89DDFF;">!=</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">nil</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">		</span><span style="color:#82AAFF;">panic</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">err</span><span style="color:#89DDFF;">)</span></span>
<span class="line"><span style="color:#A6ACCD;">	</span><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#A6ACCD;">	</span><span style="color:#676E95;font-style:italic;">// 迁移 schema ,自动创建表</span></span>
<span class="line"><span style="color:#A6ACCD;">	_ </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> db</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">AutoMigrate</span><span style="color:#89DDFF;">(&amp;</span><span style="color:#A6ACCD;">User</span><span style="color:#89DDFF;">{})</span></span>
<span class="line"><span style="color:#A6ACCD;">	db</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">Create</span><span style="color:#89DDFF;">(&amp;</span><span style="color:#A6ACCD;">User</span><span style="color:#89DDFF;">{</span><span style="color:#A6ACCD;">Name</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">Shibin</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> Age</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">18</span><span style="color:#89DDFF;">})</span><span style="color:#A6ACCD;"> </span><span style="color:#676E95;font-style:italic;">// 插入一条数据</span></span>
<span class="line"></span>
<span class="line"><span style="color:#A6ACCD;">	</span><span style="color:#89DDFF;">var</span><span style="color:#A6ACCD;"> user User</span></span>
<span class="line"><span style="color:#A6ACCD;">	db</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">First</span><span style="color:#89DDFF;">(&amp;</span><span style="color:#A6ACCD;">user</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">1</span><span style="color:#89DDFF;">)</span><span style="color:#A6ACCD;">               </span><span style="color:#676E95;font-style:italic;">// 根据整型主键查找</span></span>
<span class="line"><span style="color:#A6ACCD;">	db</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">First</span><span style="color:#89DDFF;">(&amp;</span><span style="color:#A6ACCD;">user</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">age = ?</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">18</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">)</span><span style="color:#A6ACCD;"> </span><span style="color:#676E95;font-style:italic;">// 查找 age 字段值为 18 的记录</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span></span>
<span class="line"><span style="color:#A6ACCD;">	</span><span style="color:#676E95;font-style:italic;">// 更新多个字段</span></span>
<span class="line"><span style="color:#A6ACCD;">	db</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">Model</span><span style="color:#89DDFF;">(&amp;</span><span style="color:#A6ACCD;">user</span><span style="color:#89DDFF;">).</span><span style="color:#82AAFF;">Updates</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">User</span><span style="color:#89DDFF;">{</span><span style="color:#A6ACCD;">Name</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">aaa</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> Age</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">10</span><span style="color:#89DDFF;">})</span><span style="color:#A6ACCD;"> </span><span style="color:#676E95;font-style:italic;">// 仅更新非零值字段</span></span>
<span class="line"><span style="color:#A6ACCD;">	db</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">Model</span><span style="color:#89DDFF;">(&amp;</span><span style="color:#A6ACCD;">user</span><span style="color:#89DDFF;">).</span><span style="color:#82AAFF;">Updates</span><span style="color:#89DDFF;">(map[</span><span style="color:#C792EA;">string</span><span style="color:#89DDFF;">]interface{}{</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">Name</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">Shibin</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">Age</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">17</span><span style="color:#89DDFF;">})</span></span>
<span class="line"><span style="color:#A6ACCD;">	</span></span>
<span class="line"><span style="color:#A6ACCD;">	</span><span style="color:#676E95;font-style:italic;">// 删除  逻辑删除</span></span>
<span class="line"><span style="color:#A6ACCD;">	db</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">Delete</span><span style="color:#89DDFF;">(&amp;</span><span style="color:#A6ACCD;">user</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">8</span><span style="color:#89DDFF;">)</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"></span></code></pre></div><h2 id="更新非零值字段" tabindex="-1">更新非零值字段 <a class="header-anchor" href="#更新非零值字段" aria-label="Permalink to &quot;更新非零值字段&quot;">​</a></h2><div class="language-go"><button title="Copy Code" class="copy"></button><span class="lang">go</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#89DDFF;">type</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">User</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">struct</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">	gorm</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">Model</span></span>
<span class="line"><span style="color:#A6ACCD;">	Name sql</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">NullString </span><span style="color:#676E95;font-style:italic;">// 修改 string 为 sql.NullString</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#89DDFF;">...</span></span>
<span class="line"><span style="color:#A6ACCD;">	</span><span style="color:#676E95;font-style:italic;">// sql.NullString 结构体的 Valid 设置为 true ,就可以将字段设置为零值</span></span>
<span class="line"><span style="color:#A6ACCD;">	db</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">Model</span><span style="color:#89DDFF;">(&amp;</span><span style="color:#A6ACCD;">user</span><span style="color:#89DDFF;">).</span><span style="color:#82AAFF;">Updates</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">User</span><span style="color:#89DDFF;">{</span><span style="color:#A6ACCD;">Name</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> sql</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">NullString</span><span style="color:#89DDFF;">{</span><span style="color:#A6ACCD;">String</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;&quot;</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> Valid</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">true}})</span></span>
<span class="line"><span style="color:#89DDFF;">...</span></span>
<span class="line"></span></code></pre></div><p>除了字符串的 sql.NullString 还有 sql.NullInt32 等，方法都和上面的类型</p><p>也可以使用指针的形式</p><div class="language-go"><button title="Copy Code" class="copy"></button><span class="lang">go</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#89DDFF;">type</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">User</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">struct</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">	gorm</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">Model</span></span>
<span class="line"><span style="color:#A6ACCD;">	Name </span><span style="color:#89DDFF;">*</span><span style="color:#C792EA;">string</span><span style="color:#A6ACCD;"> </span><span style="color:#676E95;font-style:italic;">// 修改 string 为 sql.NullString</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#89DDFF;">...</span></span>
<span class="line"><span style="color:#A6ACCD;">	empty </span><span style="color:#89DDFF;">:=</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;&quot;</span></span>
<span class="line"><span style="color:#A6ACCD;">	db</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">Model</span><span style="color:#89DDFF;">(&amp;</span><span style="color:#A6ACCD;">user</span><span style="color:#89DDFF;">).</span><span style="color:#82AAFF;">Updates</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">User</span><span style="color:#89DDFF;">{</span><span style="color:#A6ACCD;">Name</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&amp;</span><span style="color:#A6ACCD;">empty</span><span style="color:#89DDFF;">})</span></span>
<span class="line"><span style="color:#89DDFF;">...</span></span>
<span class="line"></span></code></pre></div><h2 id="logger" tabindex="-1">Logger <a class="header-anchor" href="#logger" aria-label="Permalink to &quot;Logger&quot;">​</a></h2><p><a href="https://gorm.io/zh_CN/docs/logger.html" target="_blank" rel="noreferrer">Logger</a></p><div class="language-go"><button title="Copy Code" class="copy"></button><span class="lang">go</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#A6ACCD;">newLogger </span><span style="color:#89DDFF;">:=</span><span style="color:#A6ACCD;"> logger</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">New</span><span style="color:#89DDFF;">(</span></span>
<span class="line"><span style="color:#A6ACCD;">  log</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">New</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">os</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">Stdout</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#A6ACCD;">\\r\\n</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> log</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">LstdFlags</span><span style="color:#89DDFF;">),</span><span style="color:#A6ACCD;"> </span><span style="color:#676E95;font-style:italic;">// io writer（日志输出的目标，前缀和日志包含的内容——译者注）</span></span>
<span class="line"><span style="color:#A6ACCD;">  logger</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">Config</span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">    SlowThreshold</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> time</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">Second</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;">   </span><span style="color:#676E95;font-style:italic;">// 慢 SQL 阈值</span></span>
<span class="line"><span style="color:#A6ACCD;">    LogLevel</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;">      logger</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">Info</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#676E95;font-style:italic;">// 日志级别</span></span>
<span class="line"><span style="color:#A6ACCD;">    IgnoreRecordNotFoundError</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">true,</span><span style="color:#A6ACCD;">   </span><span style="color:#676E95;font-style:italic;">// 忽略ErrRecordNotFound（记录未找到）错误</span></span>
<span class="line"><span style="color:#A6ACCD;">    Colorful</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;">      </span><span style="color:#89DDFF;">true,</span><span style="color:#A6ACCD;">         </span><span style="color:#676E95;font-style:italic;">// 彩色打印</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#89DDFF;">},</span></span>
<span class="line"><span style="color:#89DDFF;">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// 全局模式</span></span>
<span class="line"><span style="color:#A6ACCD;">db</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> err </span><span style="color:#89DDFF;">:=</span><span style="color:#A6ACCD;"> gorm</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">Open</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">mysql</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">Open</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">dsn</span><span style="color:#89DDFF;">),</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&amp;</span><span style="color:#A6ACCD;">gorm</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">Config</span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">  Logger</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> newLogger</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#89DDFF;">})</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// 新建会话模式</span></span>
<span class="line"><span style="color:#A6ACCD;">tx </span><span style="color:#89DDFF;">:=</span><span style="color:#A6ACCD;"> db</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">Session</span><span style="color:#89DDFF;">(&amp;</span><span style="color:#A6ACCD;">Session</span><span style="color:#89DDFF;">{</span><span style="color:#A6ACCD;">Logger</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> newLogger</span><span style="color:#89DDFF;">})</span></span>
<span class="line"><span style="color:#A6ACCD;">tx</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">First</span><span style="color:#89DDFF;">(&amp;</span><span style="color:#A6ACCD;">user</span><span style="color:#89DDFF;">)</span></span>
<span class="line"><span style="color:#A6ACCD;">tx</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">Model</span><span style="color:#89DDFF;">(&amp;</span><span style="color:#A6ACCD;">user</span><span style="color:#89DDFF;">).</span><span style="color:#82AAFF;">Update</span><span style="color:#89DDFF;">(</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">Age</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">18</span><span style="color:#89DDFF;">)</span></span>
<span class="line"></span></code></pre></div><h3 id="日志级别" tabindex="-1">日志级别 <a class="header-anchor" href="#日志级别" aria-label="Permalink to &quot;日志级别&quot;">​</a></h3><p>GORM 定义了这些日志级别：<code>Silent</code>、<code>Error</code>、<code>Warn</code>、<code>Info</code></p><h3 id="debug" tabindex="-1">Debug <a class="header-anchor" href="#debug" aria-label="Permalink to &quot;Debug&quot;">​</a></h3><p>Debug 单个操作，将当前操作的 log 级别调整为 logger.Info</p><div class="language-go"><button title="Copy Code" class="copy"></button><span class="lang">go</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#A6ACCD;">db</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">Debug</span><span style="color:#89DDFF;">().</span><span style="color:#82AAFF;">Where</span><span style="color:#89DDFF;">(</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">name = ?</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">shibin</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">).</span><span style="color:#82AAFF;">First</span><span style="color:#89DDFF;">(&amp;</span><span style="color:#A6ACCD;">User</span><span style="color:#89DDFF;">{})</span></span>
<span class="line"></span></code></pre></div>`,23),e=[o];function t(r,c,D,F,y,A){return n(),a("div",null,e)}const g=s(p,[["render",t]]);export{i as __pageData,g as default};
