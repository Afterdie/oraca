import { ContentTypes } from "./tabs/Conversation";
import VisualiseBubble from "./VisualiseBubble";
import { VisualiseBubbleProps } from "./VisualiseBubble";
import { GraphType } from "../page";
export interface ChatbubbleTypes {
  content: ContentTypes;
  thinking: boolean;
  sender: boolean;
}
const Chatbubble = ({ content, thinking, sender }: ChatbubbleTypes) => {
  const chartData = [
    { month: "January", desktop: 186, mobile: 80, tablet: 50 },
    { month: "February", desktop: 305, mobile: 200, tablet: 90 },
    { month: "March", desktop: 237, mobile: 120, tablet: 70 },
    { month: "April", desktop: 73, mobile: 190, tablet: 40 },
    { month: "May", desktop: 209, mobile: 130, tablet: 60 },
    { month: "June", desktop: 214, mobile: 140, tablet: 55 },
  ];

  const props: VisualiseBubbleProps = {
    graph: GraphType.BAR,
    chartData: chartData,
  };
  return (
    <div
      className={`flex w-full items-start ${sender ? "justify-end" : "justify-start"}`}
    >
      {/* the small icon for oraca */}
      {!sender && (
        <div className="border-accent-foreground mt-[15px] h-4 w-4 rounded-full border bg-gradient-to-tr from-blue-600 to-orange-300"></div>
      )}
      <div
        className={`${sender ? "bg-secondary max-w-[60%]" : "max-w-[90%]"} h-full rounded-lg p-2 px-4`}
      >
        <span
          className={`${thinking ? "text-foreground/60 animate-pulse italic" : ""}`}
        >
          {/* could use the content to store the graph along with a message */}
          {content.message}
        </span>
        {!thinking && content.graph && (
          <div className="w-[80%]">
            <VisualiseBubble {...props} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Chatbubble;
