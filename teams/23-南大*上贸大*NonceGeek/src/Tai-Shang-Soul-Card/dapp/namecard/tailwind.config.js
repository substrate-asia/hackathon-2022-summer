module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    fontFamily: {
      'Audiowide': ['Audiowide'],
      'Inter': ['Inter'],
    },
    fontSize: {
      'xxs': ['8px'],
      'xs': ['10px'],
      'sm': ['12px'],
      'nm': ['14px'],
      'rg': ['16px'],
      'lg': ['20px'],
      'xl': ['24px'],
      '2xl': ['28px'],
      '3xl': ['32px'],
      '4xl': ['48px'],
      '5xl': ['64px'],
    },
    extend: {
      spacing: {
        // 首页左侧栏宽度
        'home-l': '87px',
        // 主要内容区域宽度
        'main': '1040px',
        '80vh': '80vh',
        // 内容卡片小图宽度
        'thumb-sm': '80px',
        // logo 尺寸
        'logo': '56px',
        'logo-sm': '48px',
        // 中等图标尺寸
        'icon': '36px',
        // 小图标尺寸
        'icon-sm': '16px',
        // 更小图标尺寸
        'icon-xs': '8px',
        // 首页中间区域宽度
        'home-m': '726px',
        // 首页中间内容宽度
        'home-mi': '510px',
        // 右侧栏内容区域宽度
        'home-r': '214px',
      },
      colors: {
        // 首页左侧栏背景
        'home-l': '#0E1F27',
        // 首页中间区域背景
        'home-m': '#0C0F17',
        // 首页右侧栏背景
        'home-r': '#0C2834',
        // 主题绿色
        'green': '#7AD6A8',
        // 左侧栏边框色
        'green-l': '#D2F87F',
        // 浅绿色渐变 - 炫彩2 - 起始
        'lg-green2-start': '#79D5A8',
        'lg-green2-start/40': 'rgba(121, 213, 168, 0.4)',
        // 浅绿色渐变 - 炫彩2 - 结束
        'lg-green2-end': '#D5F97D',
        'lg-green2-end/40': 'rgba(213, 249, 125, 0.4)',
        // 内容卡片的灰色背景
        'card-gray': '#272727',
        // NameCard 和 Resume 卡片的背景色
        'namecard': '#0A1920',
        // 下拉菜单、输入框的背景色
        'input': '#111C27',
      },
      scale: {
        // 12px * 0.83 = 10px
        'xs': '.83',
        // 12px * 0.67 = 8px
        '2xs': '.67',
        // 12px * 0.4 = 5px
        'xxxs': '.4',
      },
    },
    plugins: [],
  }
}
  