import { ContentTypes } from "./tabs/Conversation";
import VisualiseBubble from "./VisualiseBubble";
export interface ChatbubbleTypes {
  content: ContentTypes;
  thinking: boolean;
  sender: boolean;
}
const Chatbubble = ({ content, thinking, sender }: ChatbubbleTypes) => {
  const props = content.graph;
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
        {!thinking && props && (
          <div className="mt-10 ml-10 w-[400px]">
            <VisualiseBubble {...props} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Chatbubble;
