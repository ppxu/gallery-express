# kissy gallery组件开发规范说明

v0.2 by 剑平 && 伯方

KISSY Gallery 工具正在开发过程中，**以下规范内容为过渡用**：

## 目录规范

组件目录结构说明，这些目录暂时都需要手动建立，有了工具后会自动创建。

请手动创建一个名为<code>gallery</code>的目录，然后在其下创建组件目录（git版本控制）

拿 offline 举例，具体的可以参考[example](https://github.com/kissygalleryteam/offline "例子") :

```
offline           // 组件目录名, 小写, 多字符用 – 分隔
|          |-----1.0    // 版本名字, 两个数字表示 x.x
|          |         |---------demo                         // 用于存放demo的文件夹
|          |         |---------doc                          // 用于存放组件api文档的文件夹
|          |         |---------plugin                       // 用于存放组件的插件，可以没有
|          |         |---------build                       // 用于存放组件打包后的文件
|          |         |---------guide                        // 用于介绍组件入门的文件夹
|          |         |              |--------index.md       // 用于介绍组件入门的文档
|          |         |---------spec                        // 单元测试放的目录
|          |         |---------index.js                     // 组件入口文件
|          |         |---------index.deps.js                    // 组件combo时使用的配置信息
|          |-----README.md                                  	// 用于介绍组件信息和版本更新
|          |-----package.json                                 // 组件信息
|          |-----gruntfile.js                                 // grunt打包时使用的配置信息
```

### 规范说明

* 统一使用 UTF-8编码；
* 模块起始必须是gallery名，比如"gallery/offline/1.0/index"
* index.js为组件入口文件，必须存在
* package.json为组件构建配置，必须存在（有工具后会自动生成）
* 组件的教程放在<code>guide</code>目录下，必须是<code>md</code>文件，不能是静态html页面！
* 可以在package.json中指定打包发布模块
* 打包后的文件会放在<code>build</code>目录中，发布到cdn上的只是build目录下的文件
* **.deps.js为组件combo配置，日后工具会自动生成
* README.md必须存在，简单介绍下组件信息！

### package.json内容

```javascript
{
    "name": "uploader",
    "version":"1.4",
    "author":"明河",
    "cover":"http://img02.taobaocdn.com/tps/i2/T1C1X_Xs8gXXcd0fwt-322-176.png",
    "desc":"异步文件上传组件"
}
```

## 组件打包临时方案

TODO:待补充

## 组件发布

我们需要把组件发布到淘宝cdn上，方便用户直接引用，kissy1.3配置了<code>gallery</code>包指向，淘宝cdn的地址，这样用户不需要额外配置gallery的包路径。

目前工具没搞好，组件发布，请单独联系承玉或剑平

## 组件调试

### 请将组件代码clone在自己创建的gallery目录下。

组件初始化脚本demo：

```javascript
    KISSY.use('gallery/offline/1.0/index',function (S,Offiline) {
        var a = new Offiline();
    });
```

<code>use()</code>加载的模块命名起始为gallery，缺少这个层级，在本地调试时就会报模块找不到的错误。

### 配置gallery包

```javascript
    KISSY.config({
      packages:[
        {
          name:"gallery",
          tag:"20111220",
          path:"../../../",  // 开发时目录, 发布到cdn上需要适当修改
          charset:"utf-8"
        }
      ]
    });
```

这样就可以使用本地源码文件进行调试了。

## 如何组织组件代码

一个组件模块代码如下

```javascript
/**
 * @fileoverview 文件用户
 * @author 作者的
 **/
KISSY.add(function(S, Node, Base) {
    var EMPTY = '';
    var $ = Node.all;
    /**
     * @name ImageZoom
     * @class 图片放大器
     * @since 1.4
     * @constructor
     * @extends Base
     */
    function ImageZoom(config) {
        var self = this;
        //调用父类构造函数
        ImageZoom.superclass.constructor.call(self, config);
    }
    S.extend(ImageZoom, Base, /** @lends ImageZoom.prototype*/{

    }, {ATTRS : /** @lends ImageZoom*/{

    }});
    return ImageZoom;
}, {requires : ['node','base']});
/**
 * changes:
 * 明河：1.4
 *           - XXXX
 */
```

use时

``` 
KISSY.use('gallery/uploader/1.4/plugins/imageZoom/imageZoom', function(S, ImageZoom) {
   new ImageZoom();
});
```

## 代码规范

* 代码基于kissy1.3，无需兼容kissy1.1.6
* add()模块时，不要加上模块名称，使用工具自定生成
* 组件请继承base模块，使用get()和set()方法获取/设置属性
* 推荐使用Node方式获取节点
* 不在模块内动态<code>use()</code>js和css
* 复杂组件请继承RichBase
* 组件注释符合YUIDoc规范
* js中需要模版的请使用xtemplate模块
* 请不要直接向KISSY全局变量注入属性或方法

## 临时打包方案

临时使用ant打包。

请参考[offline的打包](https://github.com/kissygalleryteam/offline) :

```xml
<project name="component.build" default="build" basedir="."  xmlns:ac="antlib:net.sf.antcontrib">
    <description>gallery component  Build File</description>
    <property name="charset" value="utf-8"/>
    <property name="name" value="offline"/>
    <property name="version" value="1.0"/>
    <property name="build.files" value="index.js"/>
    <property name="tool.dir" location="../../../kissy-tools"/>
    <property name="compiler" location="${tool.dir}/closure-compiler/compiler.jar"/>
    <property name="yuicompressor" location="${tool.dir}/yuicompressor/yuicompressor.jar"/>
    <property name="module.compiler" value="${tool.dir}/module-compiler/module-compiler.jar"/>
    <property name="build.dir" location="./build/"/>
    <property name="src.dir" location="."/>
    <target name="dircheck">
        <condition property="build.dir.exists">
            <available file="${build.dir}" type="dir"/>
        </condition>
    </target>
    <!--删除build目录下的所有文件-->
    <target name="clean-build" if="${build.dir.exists}" depends="dircheck">
        <delete >
            <fileset dir="${build.dir}" includes="**/*.js,**/*.css,**/*.swf,**/*.less"/>
        </delete>
    </target>
    <target name="mkdir">
        <mkdir dir="${build.dir}">

        </mkdir>
    </target>
    <!--压缩css文件-->
    <target name="minify-css">
        <apply executable="java" verbose="true" dest="${build.dir}" failonerror="true" parallel="false">
            <fileset dir="${build.dir}" includes="**/*.css" excludes="*-min.css"/>
            <arg line="-jar"/>
            <arg path="${yuicompressor}/"/>
            <arg line="--charset gbk"/>
            <arg value="--type"/>
            <arg value="css"/>
            <arg value="-o"/>
            <targetfile/>
            <mapper type="glob" from="*.css" to="*-min.css"/>
        </apply>
    </target>
    <!--压缩前去除页面多余空白-->
    <target name="crlf">
        <fixcrlf includes="*.js" srcdir="${build.dir}" encoding="utf8" eol="crlf"></fixcrlf>
    </target>
    <!--压缩脚本-->
    <target name="minify" depends="crlf">
        <apply executable="java" verbose="true" dest="${build.dir}" failonerror="true" parallel="false">
            <fileset dir="${build.dir}" includes="**/*.js"/>
            <arg line="-jar"/>
            <arg path="${tool.dir}/closure-compiler/compiler.jar"/>
            <arg line="--charset utf8"/>
            <arg value="--warning_level"/>
            <arg value="QUIET"/>
            <arg value="--js"/>
            <srcfile/>
            <arg value="--js_output_file"/>
            <targetfile/>
            <mapper type="regexp" from="^(.*)\.js$" to="\1-min.js"/>
        </apply>
    </target>
    <!--改变压缩文件的编码-->
    <target name="native2ascii">
        <native2ascii encoding="${charset}" src="${build.dir}" dest="${build.dir}" includes="**/*-min.js" ext=".ascii.js"/>
        <delete >
            <fileset dir="${build.dir}" includes="**/*-min.js"/>
        </delete>
        <renameext srcDir="${build.dir}" includes="**/*.ascii.js"  fromExtension=".ascii.js" toExtension=".js" replace="true"/>
    </target>

    <!--js  combo 地址获取-->
    <target name='combo'>
        <ac:for param="page">
            <!--入口模块文件所在目录的所有模块循环处理-->
            <path>
                <fileset dir="${src.dir}" includes="${build.files}"/>
            </path>
            <sequential>
                <ac:var name="var.modname" unset="true"/>
                <basename property="var.modname" file="@{page}" suffix=".js"/>
                <echo>
                    build ${var.modname} in @{page}
                </echo>
                <java classname="com.taobao.f2e.Main">
                    <arg value="-require"/>
                    <!-- 入口模块 -->
                    <arg value="gallery/${name}/${version}/${var.modname}"/>

                    <arg value="-baseUrls"/>
                    <arg value="../../../"/>

                    <arg value="-encodings"/>
                    <arg value="${charset}"/>

                    <arg value="-outputEncoding"/>
                    <arg value="${charset}"/>

                    <arg value="-output"/>
                    <arg value="${build.dir}/${var.modname}.js"/>

                    <arg value="-outputDependency"/>
                    <arg value="${build.dir}/${var.modname}.dep.js"/>

                    <classpath>
                        <pathelement path="${module.compiler}"/>
                        <pathelement path="${java.class.path}"/>
                    </classpath>
                </java>
            </sequential>
        </ac:for>
    </target>

    <target name="build" depends="clean-build,combo,minify-css,minify,native2ascii">
    </target>
</project>
```
