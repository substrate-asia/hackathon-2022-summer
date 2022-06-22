/*
 * @Author: Yosan
 * @Date: 2022-05-24 21:49:25
 * @LastEditors: Yosan
 * @LastEditTime: 2022-05-25 13:18:11
 * @Descripttion:
 */
import React, { useState } from "react";
import { Modal, Button, Space, Image } from "antd";
import "./index.less";
import icon_close from "../../image/icon_close.png";
import backicon from "../../image/backicon.png";
import { imgUrl } from "@/utils/utils";

const CommonPop = (props) => {
  let {
    contentPandding = "84",
    isModalVisible,
    handleOk,
    handleCancel,
    width = "655",
    height = "590",
    radius = "20",
    title,
    ContentPop,
    hanldeClickBack,
    myclass,
    showBackIcon = false,
   
  } = props;
  return (
    <Modal
      title={null}
      visible={isModalVisible}
      onOk={handleOk}
      closable={false}
      footer={null}
      forceRender
      centered
      key={Math.random()}
      className={`CommonPop ${myclass?'NFTwidth':''}`}
      // style={
      //   {
      //     //  width: `${width + 'px'}`,
      //     //   height: `${height + 'px'}`,
      //     //   padding: '0px'
      //   }
      // }
      // bodyStyle={{
      //   borderRadius: `${radius}+px`,
      //   height: `${height + 'px'}`,
      //   maxWidth: `${width + 'px'}`,
      //   background: '#fff',
      //   borderRadius: `${radius + 'px'}`,
      //   padding: '0px',
      // }}
      onCancel={handleCancel}
    >
      <div className="content" style={{ paddingTop: contentPandding + "px" }}>
        <div
          className="closeIcon"
          onClick={() => {
            console.log("00");
            handleCancel();
          }}
        ></div>
        <div className="backicon">
          {showBackIcon ? (
            <div
              className="imgs"
              onClick={() => {
                console.log("00");
                hanldeClickBack();
              }}
            ></div>
          ) : null}
        </div>

        {title ? <div className="title">{title}</div> : null}
        {ContentPop && ContentPop}
      </div>
      
    </Modal>
  );
};

export default CommonPop;
