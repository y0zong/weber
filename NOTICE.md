# ReThink of Web Application In Now Day


## 个人隐私和使用安全问题

**长话短说，现今web应用最大的问题在于陈旧技术架构的设计缺陷。**

1. cookie

	1. 现状。
		cookie作为上世纪90年代的产物设计之初只是作为用户状态存储的本地方案，在当初的网络环境下
	并没有复杂的用户交互，因此设计的非常简单。现如今网站的功能极具丰富，需要更为复杂的状态保
	持(如单点登录)，除此之外，商业利益下的跨站交互更是成为cookie的主要应用场景(漫天的广告互
	联)；之所以cookie能承载这样的工作源于设计之初它的特性(并非有意这样设计)：离线存储/站点
	间可共享，这样的设计对于管理**用户状态**是非常友好的，但网景公司(cookie的发明者)不会想
	如今比起*管理*用户状态*分享*用户状态成了cookie更重要的用武之地，这也是基于web的广告业务
	的核心支持。

	2. 缺陷。
		1. `用户状态保持`和`用户状态分享`是两个完全独立的问题，至少现如今看来是这样。传统的cookie
		并不能将这两者区别开来，这也是cookie一直无法真正被限制使用的原因；禁用它用户就无法完整的
		站点访问体验，反过来就无法控制自己的访问状态被无限制的分享到其他网站。最近一些浏览器厂商
		firefox和safari默认禁止第三方cookie的使用可以说是对*用户状态分享*的限制，但这并没有本
		质上作用，其一，作为浏览器市场的主力厂商chrome并不会跟进(跟google的广告经济模式相违背)
		这个策略；其二，很多站点特别是具有垄断性质的大用户站点更愿意牺牲用户体验来换取获得用户co
		okie的分享权(你现在就可以禁用第三方cookie去体验一下)，具体行为包括但不限于限制用户访问/
		登录/在页面显眼的地方一直提示你需要放开cookie的使用权；其三，一些站点主动提示需要授权co
		okie的具体使用权力，但这其实是面子工程，好一点的站点会列出具体使用了哪些分享条目并让你选择
		差一些的只有yes/no的选择，事实上还有一些站点就算你拒绝了它们还是会偷偷使用，这种技术上没有
		保障只靠站点*人为*设计的功能除了使访问体验更糟并没有好的效果。

		2. 就算是用来`保持用户状态`也并没有在安全性上有更多的保障，javascript可以很轻松的访问这
		些内容从而导致XSS(跨站脚本攻击，尽管这类攻击更多的是服务器漏洞导致的)，就算使用httpOnly
		协议后javascript无法访问但还是有可能受到CSRF(跨站请求伪造攻击)。cookie的设计之初就并没有
		为复杂网络环境下的安全做考虑。

	3. 怎么办。
		如何改变这种局面首先需要精确确认cookie的定位，即`用户状态保持`；cookie(或者将来可能会有新
		的协议)有且仅有的功能就是`用户状态保持`，这意味cookie不会保存除`用户状态`之外的任何信息，
		而且这从技术上cookie将不可分享。那么单点登录的问题怎么办呢？其一，应该新的cookie协议可以
		支持信任列表，将同一个公司的不同产品，甚至不同公司的不同产品通过授权的方式进行，其二，很多人
		可能会说这样会影响用户体验，但事实上用户不可能同时获得安全性和便捷性，而且用户授权的过程对
		便捷性的影响微乎其微，甚至一些人更希望有这个过程，因为这不仅意味着安全更体现了主导权。具体的
		web端用户状态保持机制可以参考apple在ios上的Keychain设计，换句话说，我更希望这应该是操作
		系统的层面的改善————将web的用户安全纳入进去，而不是将这个过程丢给纷繁复杂的浏览器厂商，这
		在技术上并不难实现。

		其次就是现如今庞大的广告业务依赖的*cookie分享*功能，如果我们将cookie的功能缩减至只有单纯
		的`用户状态器`，没有分享功能，也不能存储除用户状态之外的任何内容，是否会影响现如今人们的访
		问体验？我认为并不会。如今广告的存在，除了少数试图改变广告的内容和方式来寻找突破的公司让人
		眼前一亮可以获得一些关注之外，大部分人对广告是非常反感的，包括大数据下AI(智障)推荐，甚至依
		靠广告赚钱的人也绝不会在工作之外喜欢看到广告。

		> **为什么如今的广告如此让人讨厌，我认为主要原因是广告已经脱离的广告本身的含义：广告是一种信 息传播；在现代媒体化的广告模式被设计出来之前，人们之间的口口相传就是一种广告。 现如今的广告脱
		离了广告背后产品的内容，而把重点放在了和人的心理博弈上，应用各种心理学经济学社会学还有最重要
		的欺骗学的内容以最大可能性的吸引用户，这样的广告会慢慢消磨人们的兴趣以至于最后成为一种负担**

		某种层面上看，通过限制分享减少广告的曝光度会提升广告的质量，好的情况能把广告从资本沉沦中解救
		出来重新重视所传播信息的品质上而非广度。当然这会直接影响一些人的财运，但这无可避免。

	4. 是的！我的观点是**完全禁止追踪分享用户行为**的机制，至少在web产品上是这样。
		现在的问题比广告泛滥更严重，虽然大部分厂商声明追踪用户行为只是为了更好的投放广告和产品推荐，但
		没有人知道会不会有更隐蔽的应用。试试上，仅仅是*依靠用户行为*而做产品推荐就已经是很大的问题了，
		资本的驱动下，这种**择优**行为会最大化到每个人的生活的方方面面，比如：根据不同的消费水平定向
		推荐会固化消费分层，引起歧视行为，加剧攀比行为，扩大个人矛盾(事实上每个人都多少已经有体会)。
