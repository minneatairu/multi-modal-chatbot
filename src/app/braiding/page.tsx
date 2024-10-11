import React from 'react';
import ImageGenerator from "@/components/ImageGenerator";

const AboutPage = () => {
  return (
    <div>
   <form
            className="text-prompt-form expanded"
            onSubmit={handleFormSubmit}
            style={{
              backgroundColor: "black",
              color: "white",
              position: "relative",
              border: "none",
            }}
            ref={formRef}
          >
            <div className="animated-text-container">
              <div className="animated-text">
                {words.map((word, index) =>
                  word === "<br>" ? (
                    <br key={index} style={{ marginBottom: "20px" }} />
                  ) : (
                    <span
                      key={index}
                      style={{ animationDelay: `${index * 0.2}s` }}
                    >
                      {word}&nbsp;
                    </span>
                  )
                )}
              </div>
              <div>
      <ImageGenerator />
    </div>
       
            </div>

      
          </form>
  Welcome to the About Page
This is where we talk about us.
    </div>
  );
};

export default AboutPage;
