'use strict';
{
  Button_General();

  let accuracy = 1000000000000;
  let dankai = 4; //何段階設定か

  function Zikkou() {
    // 小役確率
    let cherry_kakuritu = [26.214, 25.206, 24.273, 23.406];//総回転数で算出
    let suika_kakuritu = [47.628, 45.958, 42.946, 41.584];//総回転数で算出

    let hosi_kakuritu = [19.968, 19.378, 18.296, 17.561];//ART中のG数で算出
    let hazure_kakuritu = [11.498, 10.923, 9.930, 9.362];//ART中のG数で算出
    let nabinasi_kakuritu = [2.579, 2.638, 2.750, 2.834];//ART中のG数で算出

    //以下入力値
    let soukaiten = parseInt(document.getElementById('soukaiten').value);
    let sou_art = parseInt(document.getElementById('sou_art').value);

    let cherry = parseInt(document.getElementById('cherry').value);
    let suika = parseInt(document.getElementById('suika').value);

    let djz_art = parseInt(document.getElementById('djz_art').value);
    let dt_art = parseInt(document.getElementById('dt_art').value);

    let hazure = parseInt(document.getElementById('hazure').value);
    let hosi = parseInt(document.getElementById('hosi').value);
    let rep = parseInt(document.getElementById('rep').value);

    //総art
    let art = sou_art + djz_art + dt_art;

    let result = [];
    let hiritu = [];
    let goukei = 0;
    for (let i = 0; i < dankai; i++) {
      hiritu.push(
        CalcBinom(soukaiten, cherry, cherry_kakuritu)[i] // チェリーで期待値
        * CalcBinom(soukaiten, suika, suika_kakuritu)[i] // スイカで期待値
        * CalcBinom(art, hosi, hosi_kakuritu)[i] // art中の星で期待値
        * CalcBinom(art, hazure, hazure_kakuritu)[i] // art中ハズレで期待値
        * CalcBinom(art, rep, nabinasi_kakuritu)[i] // art中の星で期待値
      );
      goukei += hiritu[i];
    }

    hiritu.forEach(e => {
      result.push(Math.round((parseFloat(e / goukei * 100)) * 100) / 100);
    });

    console.log("ちょり" + CalcBinom(soukaiten, cherry, cherry_kakuritu));
    console.log("すいか" + CalcBinom(soukaiten, suika, suika_kakuritu));
    console.log("ほし" + CalcBinom(art, hosi, hosi_kakuritu));
    console.log("はずれ" + CalcBinom(art, hazure, hazure_kakuritu));
    console.log("りぷ" + CalcBinom(art, rep, nabinasi_kakuritu));
    console.log(hiritu);
    console.log(goukei);
    // console.log(art);

    document.getElementById('r_soukaiten').textContent = " " + soukaiten + "G";
    document.getElementById('r_art_g').textContent = " " + art + "G";
    document.getElementById('r_s1').textContent = " " + result[0] + "%";
    document.getElementById('r_s2').textContent = " " + result[1] + "%";
    document.getElementById('r_s3').textContent = " " + result[2] + "%";
    document.getElementById('r_s4').textContent = " " + result[3] + "%";

    console.log(result);
  }


  function CalcBinom(n, x, array) {
    n = BigInt(n);
    x = BigInt(x);
    array = GetKoyakuKakuritu(array);

    if (n < x) {
      console.log("回転数の方が少ない");
      return;
    }

    let goukei = 0n;
    let kakuritu = [];
    //nCx * p^x * (1-p)^(n-x)
    for (let i = 0; i < dankai; i++) {
      let item1 = Combi(n, x);
      let item2 = array[i] ** x;
      let item3 = (BigInt(accuracy) - array[i]) ** (n - x);
      kakuritu.push(item1 * item2 * item3);
      goukei += kakuritu[i]
      // console.log(kakuritu[i]);
    }

    let hiritu = [];
    // let test = 0;
    for (let i = 0; i < dankai; i++) {
      hiritu.push(Math.round((parseFloat((kakuritu[i] / (goukei / BigInt(accuracy)) * 100n)) / accuracy) * 100) / 100);
    }
    // console.log(hiritu);
    return hiritu;
  }

  function GetKoyakuKakuritu(array) {
    let koyaku_kakuritu_p = [];

    for (let i = 0; i < dankai; i++) {
      koyaku_kakuritu_p.push(BigInt(Math.floor(1 / array[i] * accuracy)));
      console.log(koyaku_kakuritu_p[i]);
    }

    return koyaku_kakuritu_p;
  }


  // 再帰関数
  function Combi(x, y) {
    y = x - y;
    let val = 0n;

    if (y == 0n) {
      val = 1n;
    } else {
      val = Combi(x - 1n, y - 1n) * x / y;
    }

    return val;
  }

  // ボタン全般関数
  function Button_General() {
    document.getElementById('hanbetu').addEventListener('click', Zikkou);// 判別ボタン

    Button_Keisan('cyori_btn', 'cherry', 1);// チョリボタン
    Button_Keisan('suika_btn', 'suika', 1);// スイカボタン
    Button_Keisan('hosi_btn', 'hosi', 1);// ☆ボタン
    Button_Keisan('hazure_btn', 'hazure', 1);// ハズレボタン
    Button_Keisan('rep_btn', 'rep', 1);// リプボタン

    // dtボタンで総artに追加する(その後dt入力欄は0)
    document.getElementById('dt_btn').addEventListener('click', function () {
      document.getElementById('sou_art').value = parseInt(document.getElementById('sou_art').value) +
        parseInt(document.getElementById('dt_art').value);
      document.getElementById('dt_art').value = 0;
    });

    // djzボタンで総artに追加する(その後djz入力欄は0)
    document.getElementById('djz_btn').addEventListener('click', function () {
      document.getElementById('sou_art').value = parseInt(document.getElementById('sou_art').value) +
        parseInt(document.getElementById('djz_art').value);
      document.getElementById('djz_art').value = 0;
    });

  }

  // 良く使うボタンの関数
  function Button_Keisan(x, y, z) {
    document.getElementById(x).addEventListener('click', function () {
      document.getElementById(y).value = parseInt(document.getElementById(y).value) + z;
    });
  }

}