// keystatic.config.ts
import { config, fields, collection } from "@keystatic/core";
import {
  uniqueNamesGenerator,
  adjectives,
  animals,
} from "unique-names-generator";

export default config({
  ui: { brand: { name: "Paṭisambidha LAB" } },
  storage: {
    kind: "local",
  },
  collections: {
    tika: collection({
      label: "Tika",
      slugField: "title",
      path: "src/content/tika/*",
      columns: ["title", "sentences"] as any[],
      format: { contentField: "body" },
      schema: {
        title: fields.slug({ name: { label: "Title" } }),
        sentences: fields.array(fields.text({ label: "Sentence" }), {
          label: "Sentences",
          itemLabel: (props) => props.value,
        }),
        components: fields.blocks(
          {
            // First block option is a link to a Page
            citta: {
              label: "Citta",
              itemLabel: (props) => props.value ?? "Citta",
              schema: fields.relationship({
                label: "Citta",
                collection: "citta",
              }),
            },
          },
          { label: "Dhammas" }
        ),
        body: fields.markdoc({ label: "Body" }),
      },
    }),
    citta: collection({
      label: "Citta",
      slugField: "name",
      columns: ["name"],
      path: "src/content/citta/*",
      format: {
        contentField: "content",
      },
      schema: {
        name: fields.slug({ name: { label: "Name" } }),
        content: fields.markdoc({ label: "Content" }),
      },
    }),
    abhQuestions: collection({
      label: "Abh. Questions",
      slugField: "id",
      schema: {
        id: fields.slug({
          name: { label: "ID" },
          slug: {
            generate: () =>
              uniqueNamesGenerator({ dictionaries: [adjectives, animals] }),
          },
        }),
        question: fields.markdoc({ label: "Question" }),
        providedAnswer: fields.markdoc({ label: "Provided Answer" }),
        year: fields.integer({ label: "Year issued" }),
        qNum: fields.text({ label: "Question Number" }),
      },
    }),
  },
});
