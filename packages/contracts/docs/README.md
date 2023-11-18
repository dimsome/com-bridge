## PlantUML

[PlantUML](http://plantuml.com) is used for the technical diagrams using [Unified Modeling Language (UML)](https://en.wikipedia.org/wiki/Unified_Modeling_Language).
See [Plant UML Guide](http://plantuml.com/guide) for the syntax.

The PlantUML files have the `.puml` file extension.

To generate files, use the [node-plantuml](https://www.npmjs.com/package/node-plantuml) package installed globally.

```
npm install -g node-plantuml
```

```
cd docs
npx puml generate dexSwap.puml -o dexSwap.png
npx puml generate highLevelExchange.puml -o highLevelExchange.png
npx puml generate handleOpsNoPayMaster.puml -o handleOpsNoPayMaster.png
```

### VS Code extension

[Jebbs PlantUML](https://marketplace.visualstudio.com/items?itemName=jebbs.plantuml) extension for VS Code is used to authoring the PlantUML diagrams.

`Alt-D` on Windows, or `Option-D` on Mac, to start PlantUML preview in VS Code.

