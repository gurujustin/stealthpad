interface IFrameProps {
    src: string;
    width?: string;
    height?: string;
  }
  
  const IFrame: React.FC<IFrameProps> = ({ src, width = "560", height = "315" }) => {
    return (
      <div>
        <iframe
          width={width}
          height={height}
          src={src}
          allowFullScreen
          frameBorder={0}
          title="DefiLlama"
        />
      </div>
    );
  };
  
  export default IFrame;
  