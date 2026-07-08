# Péndulos
Este ejercicio consiste en diseñar correctamente e implementar un modelo jerárquico
que se corresponda con los péndulos mostrados en el vídeo pendulos.mp4.
Es primordial aprender a realizar correctamente este tipo de modelos articulados.
Este en concreto es bastante completo pues combina traslaciones, rotaciones y escalados
con dependencias entre dichos grados de libertad.

Explicación de los grados de libertad del ejercicio:

- La figura contiene 2 péndulos que oscilan con respecto a sus respectivos ejes.
- El péndulo superior contiene una parte central roja cuyo tamaño en Y es variable
entre 5 y 10 unidades mediante un escalado de dicha parte. Grado de libertad:
Longitud del péndulo superior.
- En los extremos de esta parte roja hay dos partes verdes, con un tamaño en Y fijo de
4 unidades. Estas partes verdes nunca se separan ni se intersecan con la roja aunque
la roja varíe de tamaño.
- El eje del péndulo superior está situado a 2 unidades en Y desde su parte superior.
Es decir, está centrado con la parte verde superior.
- El péndulo oscila a un lado y otro por su eje un máximo de 45º en cada dirección.
Es decir, entre sus 2 extremos hay un ángulo de 90º. Grado de libertad: Oscilación
del péndulo superior.
- El eje del que oscila el péndulo inferior se desplaza por la parte roja del péndulo
superior.
- Ese desplazamiento se produce entre el 10 % y el 90 % de la longitud de la parte
roja del péndulo superior. Sea cual sea la longitud de dicha parte roja. Grado de
libertad: Posición del eje del péndulo inferior.
- Independientemente, el péndulo inferior también puede alargar su tamaño en Y
entre 10 y 20 unidades. Grado de libertad: Longitud del péndulo inferior.
- El eje del péndulo inferior está siempre a 1 unidad en Y desde su parte superior.
Con independencia de su longitud.
- El péndulo inferior también puede oscilar hasta un máximo de 45º en cada direc-
ción con respecto a la posición del péndulo superior. Es decir, ese ángulo es el que
forman los 2 péndulos. Grado de libertad: Oscilación del péndulo inferior.

A tener en cuenta: En este tipo de ejercicios, un buen diseño del grafo es fundamental.
Se debe realizar primero el diseño del modelo jerárquico realizando su correspondiente
grafo y después pasar a la implementación.