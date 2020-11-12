import React, { PureComponent } from 'react';
import { Modal, Carousel } from 'antd';
import styles from './index.less';

interface ImgDetailProps {
  title: string;
}

interface ImgDetailState {
  visible: boolean;
  isVisible: boolean;
  imgList: any[];
  flag: boolean;
}

// 多张图片以轮播图的形式展示的模态框
export default class ImgDetail extends PureComponent<ImgDetailProps, ImgDetailState> {
  carousel: any;

  constructor(props: any) {
    super(props);
    this.state = {
      imgList: [],
      visible: false,
      isVisible: true,
      flag: false,
    };
  }

  // 展示模态框，并更新图片列表
  showModal = (imgList = [],page?:number) => {
    this.setState({
      imgList,
      isVisible: true,
      visible: true,
    },()=>{
      if(page&&this.carousel){
        this.goTo(page||0)
      }
    });

  };

  // 关闭模态框
  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  // 关闭以后的回调
  afterClose = () => {
    this.setState({
      isVisible: false,
    });
  };

  goTo(n?:number) {
    this.carousel.goTo(n||0,false);
  }

  // 切换到上一张图片
  prev = () => {
    this.carousel.prev();
  };

  // 切换到下一张图片
  next = () => {
    this.carousel.next();
  };

  render() {
    const { title } = this.props as any;
    const { imgList, visible, isVisible } = this.state;
    const imgListLen: number = imgList.length;
    return (
      <div className={styles.imgDetail_box}>
        {isVisible && (
          <Modal
            wrapClassName={styles.modal_box}
            className={styles.modal_content}
            title={<span style={{fontSize:'18px',fontWeight:'bold',marginLeft:'16px'}}>{title}</span>}
            visible={visible}
            // maskClosable={false}
            // destroyOnClose
            onCancel={this.handleCancel}
            footer={null}
            afterClose={this.afterClose}
            style={{ zIndex: 1010 }}
          >
            <div className={styles.banner_box}>
              {imgListLen > 1 ? (
                <div className={styles.prev} onClick={this.prev}>
                  <img src={require('@/assets/img/prev.png')} alt="" />
                </div>
              ) : (
                <></>
              )}
              <Carousel autoplay ref={node => (this.carousel = node)} effect="scrollx" speed={2000}>
                {imgList.map((item: any, index: number) => {
                  return (
                    <div key={index}>
                      <img
                        src={item.url}
                        alt=""
                        style={{ maxHeight: '400px', maxWidth: '480px', margin: '0px auto' }}
                      />
                    </div>
                  );
                })}
              </Carousel>
              {imgListLen > 1 ? (
                <div className={styles.next} onClick={this.next}>
                  <img src={require('@/assets/img/next.png')} alt="" />
                </div>
              ) : (
                <></>
              )}
            </div>
          </Modal>
        )}
      </div>
    );
  }
}
