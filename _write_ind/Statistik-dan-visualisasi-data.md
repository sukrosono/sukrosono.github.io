---
layout: full_width
title: "Statistik dan visualisasi data"
date: 2016-08-31 12:03:00 +0700
exclusiveCss:
  - /static/css/intro_d3js.css
exclusiveJs:
  - //d3js.org/d3.v4.min.js
  - //unpkg.com/q@1.4.1/q.js
  - /static/js/first_d3js.js
tags:
  - d3js
  - indonesian
---
<article class="well well-lg">
  <h1>Visualisasi data statistik penduduk indonesia menggunakan d3js
  </h1>
  <p>
    Kali ini kita akan belajar <a href="d3js.org">d3js v4</a> untuk menampilkan data, atau lebih tepatnya untuk memvisualisakikannya.
    Data yang akan kita gunakan diperoleh dari <a href="bps.go.id">BPS</a> (Badan Pusat Statistik), lebih spesifiknya dapat dilihat <a href="https://www.bps.go.id/linkTabelStatis/view/id/1904">disini</a>
  </p>
  <p>
    Untuk menggunakan d3js kita perlu mengubah format data dari excel ke csv, hal tersebut dapat dicapai menggunakan OpenOffice yang merupakan <i>open source</i>. Dengan melakukan <i>export file</i> ke csv.
  </p>
  <p>
    Dari data yang didapatkan, data sudah diklasifikasikan sesuai dengan pendidikan tertinggi yang ditamatkan. Maka kita akan tampilkan visualisasi untuk setiap kalsifikasinya untuk menampilkan perbandingan ankatan kerja dan bukan angkatan kerja sesuai pendidikan tertinggi yang ditamatkan.
    <!-- next -->
    Dari perbandingan ankatan kerja dan bukan angkatan kerja yang ada masih digolongkan lagi lebih spesifik, kita akan memberikan <i>interactify</i> pada <i>chart</i> yang ada sesuai data yang ada. Diharapkan kita lebih mengerti detail data tersebut.
  </p>
  <form class="panel panel-info col-xs-12 col-sm-12 col-md-12 col-lg-12">
    <div class="panel-body">
    <fieldset class="dataType" onchange="ptChange() col-xs-12 col-sm-11 col-md-10 col-lg-9">
    <legend>Pendidikan terkahir</legend>
      <input type="radio" value="0" name="pt" checked>Tidak/ belum pernah sekolah
      <input type="radio" value="1" name="pt">Tidak/ belum tamat SD
      <input type="radio" value="2" name="pt">SD
      <input type="radio" value="3" name="pt">SLTP
      <input type="radio" value="4" name="pt">SMU
      <input type="radio" value="5" name="pt">SMK
      <input type="radio" value="6" name="pt">Akademi/ Diploma
      <input type="radio" value="7" name="pt">Universitas
    </fieldset>
    <fieldset class="bln col-xs-4 col-sm-4 col-md-3 col-lg-2" onchange="blnChange()">
      <legend>Bulan</legend>
      <div class="row">
        <input type="radio" name="bulan" value="Februari"
        class="col-xs-6 col-md-6" checked>Februari
        <input type="radio" name="bulan" value="Agustus"
        class="col-xs-6 col-md-6">Agustus
      </div>
    </fieldset>
    <fieldset class="thn col-xs-8 col-sm-8 col-md-9 col-lg-10" onchange="thnChange()">
      <legend>Tahun</legend>
      <input type="radio" name="tahun" value="2008" checked>2008
      <input type="radio" name="tahun" value="2009">2009
      <input type="radio" name="tahun" value="2010">2010
      <input type="radio" name="tahun" value="2011">2011
      <input type="radio" name="tahun" value="2012">2012
      <input type="radio" name="tahun" value="2013">2013
      <input type="radio" name="tahun" value="2014">2014
      <input type="radio" name="tahun" value="2015">2015
    </fieldset>
    </div>
  </form>
  <figure class="fig1 well">
    <figcaption></figcaption>
  </figure>
  <p>
    Cukup memakan waktu membuat visualisasi diatas, mungkin karena skill <i>programming</i> yang belum mumpuni. Ditambah baru pertama kali memakai d3.js .
    Namun saya pribadi juga belum merasa mendapatkan <i>insight</i> jika hanya melihat grafik diatas. Teringat konsep <abbr title="Domain Name Server">DNS</abbr> bahwa adanya DNS dikarenakan otak manusia lebih mudah menghafal kata dari pada angka. Senada ketika melihat tabel statistik tersebut, mari kita coba menampilkannya dengan <i>pack layout</i> dan masih dengan lingkaran kita akan memakai <i> circle packing</i>.
  </p>
  <form class="panel panel-default row">
    <fieldset class="thn2 panel-body col-xs-12 col-sm-12 col-md-11 col-lg-10"
    onchange="thn2Change()">
      <legend>Tahun</legend>
      <input type="radio" name="tahun2" value="2008" checked>2008
      <input type="radio" name="tahun2" value="2009">2009
      <input type="radio" name="tahun2" value="2010">2010
      <input type="radio" name="tahun2" value="2011">2011
      <input type="radio" name="tahun2" value="2012">2012
      <input type="radio" name="tahun2" value="2013">2013
      <input type="radio" name="tahun2" value="2014">2014
      <input type="radio" name="tahun2" value="2015">2015
    </fieldset>
  </form>
  <figure class="fig2">
    <figcaption></figcaption>
  </figure>
  <p>
    <!-- tampilkan data pertumbuhan -->
    Terakhir kita akan gunakan <i>line chart</i> agar dapat fokus melihat perubahan data dari tahun ke tahun. Line chart sesuai untuk menampilkan perkembangan data dari waktu ke waktu maupun kurun waktu tertentu. Dan lazimnya <i>line chart</i> menampilkan sisi kronologis. Untuk tampilan pertama kita hanya akan menampilkan data x, karena kita menggunakan HTML dan d3js kita akan memberikan pilihan agar data dapat di tampilkan secara keseluruhan. Terlepas dari data yang diminati untuk dilihat, nantinya data dapat ditampilkan sesuai data yang diminati melalui form dibawah.
  </p>
  <form class="panel panel-default">
    <fieldset class="thirdForm panel-body" onchange="getCheckedList()">
      <input type="checkbox" name="top" value="ak">Total Angkatan Kerja
      <fieldset class="ak panel panel-info">
        <legend class="panel-heading">Angkatan Kerja</legend>
        <div class="panel-body">
          <label>
            <input type="checkbox" name="top" value="bekerja" checked>
            Total angkatan kerja yang bekerja
          </label>
          <fieldset class="bekerja">
            <div class="col-xs-6 col-sm-6 col-md-6 col-lg-6">
            <label>
                <input type="checkbox" value="tidak pernah sekolah">
                Tidak/belum pernah sekolah
            </label>
            <label>
                <input type="checkbox" value="tidak tamat sd">
                Tidak/belum tamat SD
            </label>
            <label>
                <input type="checkbox" value="SD">
                SD
            </label>
            <label>
                <input type="checkbox" value="SLTP">
                SLTP
            </label>
            </div>
            <div class="col-xs-6 col-sm-6 col-md-6 col-lg-6">
            <label>
              <input type="checkbox" value="SMU">
              SLTA Umum/SMU
            </label>
            <label>
              <input type="checkbox" value="SMK">
              SLTA Kejuruan/SMK
            </label>
            <label>
              <input type="checkbox" value="Diploma">
              Akademi/Diploma
            </label>
            <label>
              <input type="checkbox" value="Universitas">
              Universitas
            </label>
            </div>
          </fieldset>
          <label>
            <input type="checkbox" name="top" value="pengangguran">
            Total angkatan kerja yang berstatus pengangguran
          </label>
          <fieldset class="pengangguran">
            <div class="col-xs-6 col-sm-6 col-md-6 col-lg-6">
              <label>
                <input type="checkbox" value="tidak pernah sekolah">
                Tidak/belum pernah sekolah
              </label>
              <label>
                <input type="checkbox" value="tidak tamat sd">
                Tidak/belum tamat SD
              </label>
              <label>
                <input type="checkbox" value="SD">
                SD
              </label>
              <label>
                <input type="checkbox" value="SLTP">
                SLTP
              </label>
            </div>
            <div class="col-xs-6 col-sm-6 col-md-6 col-lg-6">
              <label>
                <input type="checkbox" value="SMU">
                SLTA Umum/SMU
              </label>
              <label>
                <input type="checkbox" value="SMK">
                SLTA Kejuruan/SMK
              </label>
              <label>
                <input type="checkbox" value="Diploma">
                Akademi/Diploma
              </label>
              <label>
                <input type="checkbox" value="Universitas">
                Universitas
              </label>
            </div>
          </fieldset>
        </div>
      </fieldset>
      <input type="checkbox" name="top" value="bak">Total Bukan Angkatan Kerja
      <fieldset class="bak panel panel-info">
        <legend class="panel-heading">Bukan Angkatan Kerja</legend>
        <div class="panel-body">
          <label>
            <input type="checkbox" name="top" value="sekolah">
            Total bukan angkatan kerja yang sedang sekolah
          </label>
          <fieldset class="sekolah row">
            <div class="col-xs-6 col-sm-6 col-md-6 col-lg-6">
              <label>
                <input type="checkbox" value="tidak pernah sekolah">
                Tidak/belum pernah sekolah
              </label>
              <label>
                <input type="checkbox" value="tidak tamat sd">
                Tidak/belum tamat SD
              </label>
              <label>
                <input type="checkbox" value="SD">
                SD
              </label>
              <label>
                <input type="checkbox" value="SLTP">
                SLTP
              </label>
            </div>
            <div class="col-xs-6 col-sm-6 col-md-6 col-lg-6">
              <label>
                <input type="checkbox" value="SMU">
                SLTA Umum/SMU
              </label>
              <label>
                <input type="checkbox" value="SMK">
                SLTA Kejuruan/SMK
              </label>
              <label>
                <input type="checkbox" value="Diploma">
                Akademi/Diploma
              </label>
              <label>
                <input type="checkbox" value="Universitas">
                Universitas
              </label>
            </div>
          </fieldset>
          <label>
            <input type="checkbox" name="top" value="mengurus">
            Total bukan angkatan kerja yang sedang mengurus
          </label>
          <fieldset class="mengurus row">
            <div class="col-xs-6 col-sm-6 col-md-6" col-lg-6>
              <label>
                <input type="checkbox" value="tidak pernah sekolah">
                Tidak/belum pernah sekolah
              </label>
              <label>
                <input type="checkbox" value="tidak tamat sd">
                Tidak/belum tamat SD
              </label>
              <label>
                <input type="checkbox" value="SD">
                SD
              </label>
              <label>
              <input type="checkbox" value="SLTP">
              SLTP
              </label>
            </div>
            <div class="col-xs-6 col-sm-6 col-md-6 col-lg-6">
              <label>
                <input type="checkbox" value="SMU">
                SLTA Umum/SMU
              </label>
              <label>
                <input type="checkbox" value="SMK">
                SLTA Kejuruan/SMK
              </label>
              <label>
                <input type="checkbox" value="Diploma">
                Akademi/Diploma
              </label>
              <label>
                <input type="checkbox" value="Universitas">
                Universitas
              </label>
            </div>
          </fieldset>
          <label>
            <input type="checkbox" name="top" value="lainnya">
            Total bukan angkatan kerja yang berstatus lainnya
          </label>
          <fieldset class="lainnya row">
            <div class="col-xs-6 col-sm-6 col-md-6 col-lg-6">
              <label>
                <input type="checkbox" value="tidak pernah sekolah">
                Tidak/belum pernah sekolah
              </label>
              <label>
                <input type="checkbox" value="tidak tamat sd">
                Tidak/belum tamat SD
              </label>
              <label>
                <input type="checkbox" value="SD">
                SD
              </label>
              <label>
                <input type="checkbox" value="SLTP">
                SLTP
              </label>
            </div>
            <div class="col-xs-6 col-sm-6 col-md-6 col-lg-6">
              <label>
                <input type="checkbox" value="SMU">
                SLTA Umum/SMU
              </label>
              <label>
                <input type="checkbox" value="SMK">
                SLTA Kejuruan/SMK
              </label>
              <label>
                <input type="checkbox" value="Diploma">
                Akademi/Diploma
              </label>
              <label>
                <input type="checkbox" value="Universitas">
                Universitas
              </label>
            </div>
          </fieldset>
        </div>
      </fieldset>
    </fieldset>
  </form>
  <figure class="fig3">
    <figcaption></figcaption>
  </figure>
  <figure class="fig3-legend">
    <!-- <figcaption></figcaption> -->
  </figure>
  <!-- kesimpulan -->
  <p>
    Setelah berhubungan lansung dengan d3.js, <abbr title="Scalable Vector Graphic">SVG</abbr> dan Statistika, tak terelakkan lagi bahwa matematika itu penting. Dari dasar SVG membuat segiempat , lingkaran, jarak antar element hingga bentuk-bentuk tingkat lanjut lainnya semua menggunakan perhitungan matematika. Semua titik yg ada di grafik diatas menggunakan SVG dan perhitungan metematika. Sekarang baru saya sadari bahwa ketika ada siswa/ pelajar yang mengeluh tentang sulitnya matematika seharusnya ia berfokus pada seberapa bermanfaatnya dia nanti ketika dapat mengimplementasikan matematika bukannya berfokus pada betapa sukarnya mempelajari matematika.
  </p>
</article>
