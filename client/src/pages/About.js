/**
 * @file Renders About page
 * @author Harry Rudolph
 */

import React from "react";

/**
 * Component returns an 'About page'
 * @returns Information to be displayed on About page.
 */
const About = () => {
  return (
    <div className="mx-3 mt-2 text-center">
      This is a student project created by Harry. If you have any questions or
      wish to report bugs, please email{" "}
      <a href="mailto:hebrewhabit@protonmail.com">
        hebrewhabit@protonmail.com.
      </a>
      <br></br>
      Complete the survey{" "}
      <a href="https://strathsci.qualtrics.com/jfe/form/SV_26rAhALszfUMMyG">
        here.
      </a>
      <hr></hr>
      <div>
        <h3>Based on Science</h3>
        Based on the curve of forgetting, we prompt you to review the flashcard
        just before you are likely to forget it. Once you have learned to read
        the Aleph Bet, try reading some words that you might already know from
        your native language.
      </div>
      <div className="">
        <h3>The Aleph Bet</h3>
        Modern Hebrew's writing system uses an Abjad. An Abjad is like an
        alphabet, but with a few key distincitons. For the most part vowels are
        not written down. It's like writing: "Hll Wrld!", you do not need the
        vowels as you can understand what is written from the context. As you
        know the words Hello, and World, you can automatically read "Hll Wrld"
        as "Hello World". When you beginning to learn Hebrew you might not to
        guess the word based on the context (in this example you might read
        "Hell World" instead). As you learn more vocabulary this problem is less
        common.
        <br />
        <h4>Vowel System</h4>
        To help solve the misreading problem, Modern Hebrew does have a vowel
        system. Most of the time vowels are not written, however you will see
        them occassioanlly, particularly in material aimed at children. It can
        be useful to know the vowels so that you can know how to pronounce new
        words.I would recommend to use a site like forvo.com to hear a native
        speaker pronounce any new word so that you know you are 'reading' it
        correctly (the voice in your head is reading it correctly).
      </div>
    </div>
  );
};

export default About;
