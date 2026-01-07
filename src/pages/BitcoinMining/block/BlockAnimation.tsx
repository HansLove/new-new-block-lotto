import './style.scss';

export default function BlockAnimation() {
  return (
    <div className="block-animation-container">
      <div className="block-cube">
        <div className="block-face front">
          <div className="block-hash">₿</div>
        </div>
        <div className="block-face back">
          <div className="block-hash">₿</div>
        </div>
        <div className="block-face right">
          <div className="block-hash">₿</div>
        </div>
        <div className="block-face left">
          <div className="block-hash">₿</div>
        </div>
        <div className="block-face top">
          <div className="block-hash">₿</div>
        </div>
        <div className="block-face bottom">
          <div className="block-hash">₿</div>
        </div>
      </div>
    </div>
  );
}

