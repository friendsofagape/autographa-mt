# AutographaMT
AutographaMT is a web-based application that aims to support automatic translation of the Bible into languages that have _no_ available digital text useful for training conventional machine translation models. AutographaMT attempts to generate a machine translations of the source text employing minimal effort of human translators.

### Workflow
In its initial phase, it employs a simple strategy that is able to achieve reasonable success with little human translation effort. The process that is followed to achieve this is:
1) Identification/Initialization: A suitable source language (usually a gateway language) in which a Bible translation already exists and available is selected. Ideally, the selected source language would have similar syntanctic structure with the target language. This is then uploaded into the system.
2) Extraction: All the unique occurances of tokens (also phrases) are extracted and listed. This includes inflected forms of words.
3) Human Translation: A qualified translator then translates all the tokens extracted in step 2.
4) Machine Generation: The system then generates a draft translation (called draft 0) of the source text by way of simple replacements.

All these steps are facilitated within AutographaMT.

### Features
- User authentication and role management
- Unique token and phrase extraction logic
- Translation input interface
- Just-in-time resources: concordance, translationWords, translationNotes, Greek/Hebrew word information
- Basic translation progress status
- Ability to save multiple sense for the same token/phrase
- One-click generation of draft translation in target language
- Free and open-source

## FAQ
1) Who built AutographaMT?
AutographaMT is built by a team of developers in India and funded by `Friends of Agape`. The work started in 2017 and the original version was called [MT2414](https://github.com/friendsofagape/mt2414). The application has since been re-written for improving usability and better maintainability and the client application lives in this repository. Currently there are 4 full-time developers and 1 part-time developer who works on this project focussing on different aspects of the system.

2) What has been achieved using AutographaMT?
The application was successfully used to generate the starting drafts for the onging translation of 12 Old Testament translation projects.

3) Can I use AutographaMT?
Everyone is encouraged to use AutographaMT. In fact, the application is designed to handle multiple organizations and individuals to be able to work simultaneously. To start simply sign-up at autographamt.com. The (quick) initial step is to create and setup your organization on the website. If you have any questions, please do not hesitate to create an issue or mail us at autographa.support@bridgeconn.com
