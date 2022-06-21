import * as React from 'react';
import classNames from 'classnames';

interface BacktopProps {
  showHeight: number; //当页面滚动高度超过此值(默认是200)时显示"返回顶部"按钮
  target: () => HTMLElement;
  className?: string; //自定义样式名称
  children?: React.ReactNode;
}

interface BacktopStates {
  isShow: boolean;
}

export default class Backtop extends React.Component<BacktopProps, BacktopStates> {
  static defaultProps = {
    showHeight: 200,
    target: () => window,
  };

  targetNode: HTMLElement | (Window & { scrollTop: number });

  /**
   * @constructor
   */
  constructor(props: BacktopProps) {
    super(props);

    this.state = {
      isShow: false,
    };

    this.handleScroll = this.handleScroll.bind(this);
    this.scrollToTop = this.scrollToTop.bind(this);
    this.throttle = this.throttle.bind(this);
  }

  // 节流函数
  throttle(fun: any) {
    fun.tid && clearTimeout(fun.tid);
    fun.tid = setTimeout(() => fun.call(), 100);
  }

  //处理scroll事件
  handleScroll(): void {
    const { showHeight } = this.props,
      scrollHeight = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
    this.setState({
      isShow: scrollHeight >= showHeight,
    });
  }

  //滚动到顶部
  scrollToTop(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
    this.setState({
      isShow: false,
    });
  }

  componentDidMount() {
    this.targetNode = this.props.target();
    //加载页面后先判断一下是否显示“滚回顶部”icon 防止用户设置进入页面时向下滚动一定距离的情况
    this.handleScroll();

    this.targetNode.addEventListener('scroll', () => this.throttle(this.handleScroll));
  }

  componentWillUnmount() {
    this.targetNode.removeEventListener('scroll', () => this.throttle(this.handleScroll));
  }

  render() {
    const { isShow } = this.state,
      { className } = this.props,
      cls = classNames('back-top', className, { hidden: !isShow });

    return (
      <div className={cls} onClick={this.scrollToTop}>
        <img src="/images/icon_back_top.svg" alt="icon_back_top" />
      </div>
    );
  }
}
