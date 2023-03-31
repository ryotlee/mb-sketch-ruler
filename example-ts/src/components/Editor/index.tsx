import React, {
  memo,
  useState,
  useRef,
  useMemo,
  CSSProperties,
  useLayoutEffect,
} from "react";
import ReactRuler from "mb-sketch-ruler";
import "./index.css";

const thick = 16;

export interface EditorProps {
  scale: number;
  lang: string;
  pageW: number;
  pageH: number;
  showReferLine: boolean;
  lines?: {
    h: [];
    v: [];
  };
}

const Editor = (props: EditorProps) => {
  const { showReferLine, pageW, pageH } = props;

  const [scale, setScale] = useState(props.scale);
  const [isShowRuler, setIsShowRuler] = useState(true); // 是否显示ruler
  const [isShowReferLine, setIsShowReferLine] = useState(showReferLine);
  const [lang, setLang] = useState(props.lang);
  const [editorW] = useState(window.screen.width);
  const [editorH] = useState(window.screen.height);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [h, setH] = useState([]);
  const [v, setV] = useState([]);

  const appRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef(null);

  useLayoutEffect(() => {
    // 滚动居中
    const _app: HTMLDivElement | null = appRef.current;
    const _container: HTMLDivElement | null = containerRef.current;
    _app!.scrollLeft = _container!.getBoundingClientRect().width / 2 - 300;
  }, []);

  const handleShowRuler = () => {
    setIsShowRuler(!isShowRuler);
  };
  const handleChangeCh = () => {
    setLang("zh-CN");
  };
  const handleChangeEn = () => {
    setLang("en");
  };

  const handleLine = (lines: { h: []; v: [] }) => {
    setH(lines.h);
    setV(lines.v);
  };

  // 显示/影藏参考线
  const handleShowReferLine = () => {
    setIsShowReferLine(!isShowReferLine);
  };

  const handleScroll = () => {
    const screensRect = document
      .querySelector("#screens")!
      .getBoundingClientRect();
    const canvasRect = document
      .querySelector("#canvas")!
      .getBoundingClientRect();
    // 标尺开始的刻度
    const _startX = (screensRect.left + thick - canvasRect.left) / scale;
    const _startY = (screensRect.top + thick - canvasRect.top) / scale;

    setStartX(_startX);
    setStartY(_startY);
  };

  const handleWheel = (e: any) => {
    if (e.ctrlKey || e.metaKey) {
      // e.preventDefault();
      const nextScale = parseFloat(
        Math.max(0.2, scale - e.deltaY / 500).toFixed(2)
      );
      setScale(nextScale);
    }
  };

  const canvasStyle: CSSProperties = useMemo(
    () => ({
      width: pageW,
      height: pageH,
      transform: `scale(${scale})`,
    }),
    [pageW, pageH, scale]
  );

  const shadow: CSSProperties = {
    left: 0,
    top: 0,
    width: pageW,
    height: pageH,
  };

  return (
    <div className="wrapper">
      <div className="controls">
        <button className="button" onClick={handleShowRuler}>
          {!isShowRuler ? "显示" : "隐藏"}标尺
        </button>
        <button className="button-ch" onClick={handleChangeCh}>
          中
        </button>

        <button className="button-en" onClick={handleChangeEn}>
          英
        </button>

        <div className="scale-value">{`scale: ${scale}`}</div>
      </div>
      {isShowRuler && (
        <ReactRuler
          lang={lang}
          thick={thick}
          scale={scale}
          width={editorW}
          height={editorH}
          startX={startX}
          startY={startY}
          shadow={shadow}
          horLineArr={h}
          verLineArr={v}
          handleLine={handleLine}
          cornerActive={true}
          palette={{
            bgColor: "#333333", // ruler bg color
            longfgColor: "#BABBBC", // ruler longer mark color
            shortfgColor: "#C8CDD0", // ruler shorter mark color
            // shortfgColor: "red", // ruler shorter mark color
            fontColor: "#FFFFFF", // ruler font color
            shadowColor: "#333333", // ruler shadow color
            lineColor: "#EB5648",
            borderColor: "#333",
            cornerActiveColor: "#333333",
          }}
          // 右键菜单props
          isOpenMenuFeature={true}
          handleShowRuler={handleShowRuler}
          isShowReferLine={isShowReferLine}
          handleShowReferLine={handleShowReferLine}
        />
      )}
      <div
        ref={appRef}
        id="screens"
        onScroll={handleScroll}
        onWheel={handleWheel}
      >
        <div ref={containerRef} className="screen-container">
          <div id="canvas" style={canvasStyle}>
            {/* 组件测试 */}
            <div
              style={{
                position: "absolute",
                left: "-30px",
                top: "120px",
              }}
            >
              <p>哈哈哈，这是一个控件</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(Editor);
