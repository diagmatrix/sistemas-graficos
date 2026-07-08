# Geometría por Barrido
Mediante este ejercicio el alumno aprenderá varias cosas.

1. Crear contornos con THREE.Shape.
2. Usar dichos contornos para realizar extrusiones (con y sin bisel).
3. Usar dichos contornos para realizar barridos por una trayectoria definida mediante puntos.

El vídeo geometria-barrido.mp4 muestra un posible resultado. En el vídeo,
las figuras diamante y corazón están hechas con extrusión con bisel. Las figuras pica y
trébol están hechas también con extrusión con bisel salvo el pie que está hecho con una
revolución. Para las columnas se han aprovechado los contornos del trebol y corazón
para hacer un barrido por una trayectoria de varios puntos.
No es necesario implementar las rotaciones que se muestran en el vídeo.
Basta con que se aprenda a crear figuras con esa topología: el barrido de un
contorno.

A tener en cuenta: Para la trayectoria del barrido se ha usado THREE.CatmullRomCurve3.