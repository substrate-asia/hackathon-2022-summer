<template>
  <div class="hello">
    <div class="head">
      <div class="cot">
        <div class="logo">
          <img
            src="../assets/image/login.png"
            width="250"
            height="58"
            alt="StaFiDAO"
          />
        </div>
        <div class="nav">
          <div class="li"><a href="./index.html">MAIN</a></div>
          <div class="li"><a href="./about.html">WHAT IS</a></div>
          <div class="li"><a href="./governance.html">GOVERNANCE</a></div>
          <div class="li"><a href="./docs.html">DOCS</a></div>
          <div class="li"><a href="./contact.html">CONTACT US</a></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Header",
  props: {
    msg: String,
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
image {
  border: 1px solid #000;
}
</style>
