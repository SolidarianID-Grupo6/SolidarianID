- Instalamos la guía de estilo de **AirBNB**:
```bash
npx install eslint-config-airbnb
```
- Editamos el fichero `.eslintrc.json` para extender y parsear la librería de *AirBNB*:
	- Lo ponemos el último para que sobreescriba a los demás:
```TS
extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'airbnb-base'
  ],
  settings: {
    'import/resolver': {
      typescript: {}
    },
  },
```
- Ahora configuraremos los comandos *run* del fichero `package.json` para que funcionen con el linter y el comando *fix*:
```JSON
"scripts": {
	"lint": "eslint \"{src,apps,libs,test}/**/*.ts\"",
	"lint:fix": "eslint \"{src,apps,libs,test}/**/*.ts\" --fix"
}
```
- Ahora, vamos a instalar la extensión oficial de **ESLint** para que el linter funcione en el propio editor:
![[Pasted image 20241205104433.png]]
- Ahora solo debemos de ejecutar `npm run lint:fix` para verificar todos los errores. Podemos ver que tenemos 16 errores, los vamos solucionando:
![[Pasted image 20241205105459.png]]
- Ahora no tenemos ningún error:
![[Pasted image 20241205111311.png]]
- Para ello hemos tenido que añadir distintas reglas que deshabilitan ciertas características:
	- En `.eslintrc.js`:
```TS
rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    "import/no-extraneous-dependencies": [
      "error",
      {"devDependencies": true}
    ],
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        ts: 'never',
        tsx: 'never',
        js: 'never',
        jsx: 'never',
      },
    ],
    'import/prefer-default-export': 'off',
    'implicit-arrow-linebreak': 'off',
    'class-methods-use-this': 'off'
  },
```
- Todos los errores que **ESLint** ha encontrado son en los ficheros de código base. Por ello, y porque suponemos que dichos ficheros están codificados según la norma del propio Nest JS, hemos decidido no incorporar las reglas de AirBNB en nuestro proyecto. O bien, vamos a quedarnos con las comunes que ya vienen preinstaladas en el proyecto de NestJS por defecto, o vamos a incorporar la extensión **SonarLint** y unir la extensión con nuestras reglas de nuestro servidor **SonarQube**. Así no solo podríamos especificar las reglas con mayor facilidad, si no que, también tendríamos mayor cohesión de reglas entre el análisis estático de Sonar y los informes que genera y podríamos trabajar con dichas reglas en el propio editor de VSCode sin tener que esperar a que se ejecutase el pipeline automático de Sonar con GitHub Actions para poder verificar que no tenemos ningún bug o codesmell.
- Para más información consultesé la guía en este directorio de la gestión de Sonar en el proyecto de SolidarianID.