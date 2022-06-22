<template>
  <div class="linear-btn" :class="{ primary: type == 'primary' }">
    <div class="linear-btn-content medium">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  props: ["type"],
};
</script>

<style lang="less" scoped>
.linear-btn {
  display: inline-block;
  font-family: inherit;
  user-select: none; // 禁止用户选中
  cursor: pointer;
  text-align: center;
  position: relative;
  overflow: hidden;
  border: 1px solid #88a8ff;
  font-size: 14px;
  border-radius: 70px;

  cursor: pointer;

  &::after {
    content: "";
    display: block;
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    pointer-events: none;
    background-image: radial-gradient(circle, white 10%, transparent 11%);
    background-repeat: no-repeat;
    background-position: 50%;
    transform: scale(12, 12);
    opacity: 0;
    transition: transform 0.6s, opacity 0.6s;
  }

  &:active::after {
    transform: scale(0, 0);
    opacity: 0.3;
    //设置初始状态
    transition: 0s;
  }

  &:hover,
  &.primary {
    &::after {
      background-image: radial-gradient(circle, black 10%, transparent 11%);
    }

    background: #3965ff;
    border-color: #3965ff;
    .linear-btn-content {
      color: white !important;
    }
    .linear-btn-content {
      color: #121619;
      background: transparent;
      -webkit-text-fill-color: initial;
    }
  }

  .linear-btn-content {
    transition: all 0.2s;
    color: #88a8ff;
    padding: 15px 22px;
  }
}
</style>