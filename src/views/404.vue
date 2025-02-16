<template>
  <div class="notfound">
    <p>404</p>
    <h2>看起来你迷路了</h2>
    <h5>你所寻找的页面已丢失!</h5>
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
.notfound {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background: url('@/assets/404.gif');
  background-position: center;
  background-repeat: no-repeat;
}
.notfound p {
  position: absolute;
  top: 3rem;
  font-size: 7rem;
  color: #00000063;
}
.notfound h2 {
  position: absolute;
  bottom: 8rem;
  font-size: 34px;
}
.notfound h5 {
  position: absolute;
  bottom: 6rem;
  color: #9c9c9c;
}
</style>