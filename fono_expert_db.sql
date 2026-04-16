-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 16-04-2026 a las 08:23:00
-- Versión del servidor: 12.2.2-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `fono_expert_db`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `anamnesis`
--

CREATE TABLE `anamnesis` (
  `id_anamnesis` int(11) NOT NULL,
  `id_nino` int(11) NOT NULL,
  `fecha_registro` datetime DEFAULT current_timestamp(),
  `herencia_familiar` tinyint(1) DEFAULT 0,
  `otitis_frecuente` tinyint(1) DEFAULT 0,
  `complicacion_parto` tinyint(1) DEFAULT 0,
  `bilinguismo` tinyint(1) DEFAULT 0,
  `uso_chupon_biberon` tinyint(1) DEFAULT 0,
  `dificultad_masticar` tinyint(1) DEFAULT 0,
  `respira_boca` tinyint(1) DEFAULT 0,
  `muda_dientes` tinyint(1) DEFAULT 0,
  `evitacion_social` tinyint(1) DEFAULT 0,
  `vibracion_lengua` tinyint(1) DEFAULT 0,
  `error_escritura` tinyint(1) DEFAULT 0,
  `error_lectura` tinyint(1) DEFAULT 0,
  `conciencia_error` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `catalogo_diagnosticos`
--

CREATE TABLE `catalogo_diagnosticos` (
  `id_diagnostico` int(11) NOT NULL,
  `nombre_diagnostico` varchar(100) NOT NULL,
  `definicion_sencilla` text DEFAULT NULL,
  `categoria` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

--
-- Volcado de datos para la tabla `catalogo_diagnosticos`
--

INSERT INTO `catalogo_diagnosticos` (`id_diagnostico`, `nombre_diagnostico`, `definicion_sencilla`, `categoria`) VALUES
(1, 'Apraxia del Habla Infantil (AHI)', 'Dificultad para planificar los movimientos necesarios para hablar. El niño sabe lo que quiere decir pero su cerebro tiene problemas para coordinar los músculos del habla.', 'Habla'),
(2, 'Apraxia Severa', 'Forma más grave de apraxia del habla, con intentos de búsqueda articulatoria visibles.', 'Habla'),
(3, 'Trastorno Fonológico', 'El niño omite o sustituye sonidos al hablar de manera consistente. Sabe cómo deberían sonar pero tiene dificultad para organizar los sonidos.', 'Habla'),
(4, 'Trastorno Fonológico Generalizado', 'Afecta a múltiples sonidos del habla, comprometiendo gravemente la inteligibilidad del lenguaje.', 'Habla'),
(5, 'Trastorno Fonológico Específico para /r/', 'Dificultad específica para producir el sonido de la letra R (vibrante simple).', 'Habla'),
(6, 'Trastorno Fonológico Específico para /s/', 'Dificultad específica para producir el sonido de la letra S.', 'Habla'),
(7, 'Trastorno Fonológico Específico para /l/', 'Dificultad específica para producir el sonido de la letra L.', 'Habla'),
(8, 'Dislalia Funcional', 'Error en la articulación de uno o varios fonemas sin causa orgánica aparente.', 'Habla'),
(9, 'Trastorno Fonético-Fonológico', 'Combinación de dificultades articulatorias y de organización fonológica.', 'Habla'),
(10, 'Trastorno Severo del Habla', 'El habla del niño es muy difícil de entender incluso para personas cercanas.', 'Habla'),
(11, 'Trastorno Expresivo del Lenguaje', 'El niño tiene dificultad para expresar sus ideas con palabras, aunque comprende bien lo que le dicen.', 'Lenguaje'),
(12, 'Trastorno Mixto del Lenguaje', 'Dificultad tanto para comprender como para expresar el lenguaje.', 'Lenguaje'),
(13, 'Discrepancia Comprensión-Expresión', 'Diferencia significativa entre lo que el niño entiende y lo que puede expresar.', 'Lenguaje'),
(14, 'Trastorno Gramatical', 'Dificultad para usar correctamente los tiempos verbales, género, número y estructura de oraciones.', 'Lenguaje'),
(15, 'Trastorno Semántico', 'Dificultad para comprender el significado de palabras y oraciones.', 'Lenguaje'),
(16, 'Trastorno Mixto Gramatical-Semántico', 'Combinación de dificultades gramaticales y semánticas.', 'Lenguaje'),
(17, 'Trastorno Fonológico-Gramatical', 'Combinación de dificultades fonológicas y gramaticales.', 'Lenguaje'),
(18, 'Trastorno de Procesamiento Auditivo', 'Dificultad para procesar la información que llega por el oído, a pesar de tener audición normal.', 'Procesamiento'),
(19, 'Trastorno de Memoria Auditiva', 'Dificultad para recordar información que se presenta de forma auditiva.', 'Procesamiento'),
(20, 'Asimetría en Procesamiento de Canales', 'Diferencia significativa entre el procesamiento auditivo y visual.', 'Procesamiento'),
(21, 'Tartamudez', 'Interrupción involuntaria del flujo normal del habla, con repeticiones, prolongaciones o bloqueos.', 'Fluidez'),
(22, 'Tartamudez Leve', 'Forma leve de tartamudez, sin evitación de palabras ni ansiedad significativa.', 'Fluidez'),
(23, 'Tartamudez Severa', 'Forma grave de tartamudez con evitación de palabras y ansiedad al hablar.', 'Fluidez'),
(24, 'Disfluencia Normal', 'Alteraciones temporales del habla que son normales en el desarrollo infantil.', 'Fluidez'),
(25, 'Dificultad de Acceso Semántico', 'Dificultad para encontrar palabras por su significado (como recordar nombres de categorías).', 'Lenguaje'),
(26, 'Dificultad de Acceso Fonológico', 'Dificultad para encontrar palabras por su sonido (como palabras que empiezan con una letra específica).', 'Lenguaje'),
(27, 'Dislexia Fonológica', 'Dificultad para leer palabras inventadas o desconocidas. Problemas con la correspondencia letra-sonido.', 'Lectura'),
(28, 'Dislexia Superficial', 'Dificultad para leer palabras de baja frecuencia o con ortografía irregular.', 'Lectura'),
(29, 'Trastorno de Comprensión Lectora', 'El niño puede leer las palabras pero tiene dificultad para entender lo que lee.', 'Lectura'),
(30, 'Disgrafía', 'Dificultad para escribir de forma legible y organizada.', 'Escritura'),
(31, 'Disfonía Funcional', 'Alteración de la voz sin causa orgánica aparente (por mal uso vocal).', 'Voz'),
(32, 'Disfonía Orgánica por Nódulos', 'Alteración de la voz causada por nódulos en las cuerdas vocales.', 'Voz'),
(33, 'Trastorno de Procesamiento Auditivo Central (TPAC)', 'Dificultad para procesar la información auditiva a nivel del sistema nervioso central.', 'Procesamiento'),
(34, 'Trastorno Mixto: Apraxia + Trastorno Expresivo', 'Combinación de apraxia del habla y dificultades expresivas del lenguaje.', 'Mixto'),
(35, 'Trastorno Fonológico con Retraso de Lenguaje', 'Combinación de dificultades fonológicas y retraso general del lenguaje expresivo.', 'Mixto'),
(36, 'Trastorno Mixto: Tartamudez + Trastorno Fonológico', 'Combinación de tartamudez y dificultades fonológicas.', 'Mixto'),
(37, 'Dislexia Fonológica asociada a Trastorno Fonológico', 'Combinación de dislexia fonológica y trastorno fonológico.', 'Mixto'),
(38, 'Trastorno Auditivo-Apráxico', 'Combinación de trastorno de procesamiento auditivo y apraxia del habla.', 'Mixto'),
(39, 'Trastorno Semántico-Expresivo', 'Combinación de dificultades semánticas y expresivas.', 'Mixto'),
(40, 'Trastorno Mixto: Disfonía + Tartamudez', 'Combinación de disfonía funcional y tartamudez.', 'Mixto');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `catalogo_hechos`
--

CREATE TABLE `catalogo_hechos` (
  `id_hecho` int(11) NOT NULL,
  `codigo_h` varchar(10) NOT NULL,
  `descripcion_hecho` varchar(255) NOT NULL,
  `categoria_clinica` varchar(50) DEFAULT NULL,
  `instrumento_origen` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

--
-- Volcado de datos para la tabla `catalogo_hechos`
--

INSERT INTO `catalogo_hechos` (`id_hecho`, `codigo_h`, `descripcion_hecho`, `categoria_clinica`, `instrumento_origen`) VALUES
(1, 'H001', 'Precisión en /r/ (vibrante simple)', 'Fonologico', 'PEFF'),
(2, 'H002', 'Precisión en /rr/ (vibrante múltiple)', 'Fonologico', 'PEFF'),
(3, 'H003', 'Precisión en /s/', 'Fonologico', 'PEFF'),
(4, 'H004', 'Precisión en /l/', 'Fonologico', 'PEFF'),
(5, 'H005', 'Precisión en /k/', 'Fonologico', 'PEFF'),
(6, 'H006', 'Precisión en /t/', 'Fonologico', 'PEFF'),
(7, 'H007', 'Precisión en /d/', 'Fonologico', 'PEFF'),
(8, 'H008', 'Precisión en /p/', 'Fonologico', 'PEFF'),
(9, 'H009', 'Precisión en /b/', 'Fonologico', 'PEFF'),
(10, 'H010', 'Precisión en /g/', 'Fonologico', 'PEFF'),
(11, 'H011', 'Precisión en /m/', 'Fonologico', 'PEFF'),
(12, 'H012', 'Precisión en /n/', 'Fonologico', 'PEFF'),
(13, 'H013', 'Precisión en /ñ/', 'Fonologico', 'PEFF'),
(14, 'H014', 'Precisión en /f/', 'Fonologico', 'PEFF'),
(15, 'H015', 'Precisión en /j/', 'Fonologico', 'PEFF'),
(16, 'H016', 'Precisión en /ch/', 'Fonologico', 'PEFF'),
(17, 'H017', 'Precisión en /y/', 'Fonologico', 'PEFF'),
(18, 'H018', 'Precisión en /x/', 'Fonologico', 'PEFF'),
(19, 'H019', 'Precisión en grupos consonánticos', 'Fonologico', 'PEFF'),
(20, 'H020', 'Omisión de fonemas', 'Error', 'PEFF'),
(21, 'H021', 'Sustitución de fonemas', 'Error', 'PEFF'),
(22, 'H022', 'Distorsión de fonemas', 'Error', 'PEFF'),
(23, 'H023', 'Inconsistencia en errores', 'Error', 'PEFF'),
(24, 'H024', 'Inteligibilidad (%)', 'General', 'PEFF'),
(25, 'H025', 'Dificultad en diadococinesia', 'Motor', 'PEFF'),
(26, 'H026', 'Dificultad en praxias orales', 'Motor', 'PEFF'),
(27, 'H027', 'Alteración en estructuras anatómicas orales', 'Estructural', 'PEFF'),
(28, 'H028', 'Dificultad en repetición de sílabas CV', 'Articulacion', 'TAR'),
(29, 'H029', 'Dificultad en repetición de sílabas CVC', 'Articulacion', 'TAR'),
(30, 'H030', 'Dificultad en repetición de palabras bisílabas', 'Articulacion', 'TAR'),
(31, 'H031', 'Dificultad en repetición de palabras trisílabas', 'Articulacion', 'TAR'),
(32, 'H032', 'Dificultad en repetición de palabras polisílabas', 'Articulacion', 'TAR'),
(33, 'H033', 'Simplificación de grupos consonánticos', 'Fonologico', 'TAR'),
(34, 'H034', 'Reducción de sílabas', 'Fonologico', 'TAR'),
(35, 'H035', 'Vocabulario receptivo (percentil)', 'Lenguaje', 'TEVI-R'),
(36, 'H036', 'Vocabulario receptivo < percentil 25', 'Lenguaje', 'TEVI-R'),
(37, 'H037', 'Vocabulario receptivo < percentil 10', 'Lenguaje', 'TEVI-R'),
(38, 'H038', 'Vocabulario expresivo (percentil)', 'Lenguaje', 'TEVI-R'),
(39, 'H039', 'Vocabulario expresivo < percentil 25', 'Lenguaje', 'TEVI-R'),
(40, 'H040', 'Vocabulario expresivo < percentil 10', 'Lenguaje', 'TEVI-R'),
(41, 'H041', 'Discrepancia receptivo-expresivo > 20%', 'Lenguaje', 'TEVI-R'),
(42, 'H042', 'Forma (morfosintaxis) percentil', 'Lenguaje', 'PLON-R'),
(43, 'H043', 'Forma < percentil 10', 'Lenguaje', 'PLON-R'),
(44, 'H044', 'Contenido (semántica) percentil', 'Lenguaje', 'PLON-R'),
(45, 'H045', 'Contenido < percentil 10', 'Lenguaje', 'PLON-R'),
(46, 'H046', 'Uso (pragmática) percentil', 'Lenguaje', 'PLON-R'),
(47, 'H047', 'Uso < percentil 10', 'Lenguaje', 'PLON-R'),
(48, 'H048', 'Longitud media de enunciado (LME)', 'Lenguaje', 'PLON-R'),
(49, 'H049', 'LME < esperado para edad', 'Lenguaje', 'PLON-R'),
(50, 'H050', 'Morfosintaxis (BLOC) percentil', 'Lenguaje', 'BLOC'),
(51, 'H051', 'Morfosintaxis < percentil 10', 'Lenguaje', 'BLOC'),
(52, 'H052', 'Semántica (BLOC) percentil', 'Lenguaje', 'BLOC'),
(53, 'H053', 'Semántica < percentil 10', 'Lenguaje', 'BLOC'),
(54, 'H054', 'Fonología (BLOC) percentil', 'Lenguaje', 'BLOC'),
(55, 'H055', 'Fonología < percentil 10', 'Lenguaje', 'BLOC'),
(56, 'H056', 'Pragmática (BLOC) percentil', 'Lenguaje', 'BLOC'),
(57, 'H057', 'Pragmática < percentil 10', 'Lenguaje', 'BLOC'),
(58, 'H058', 'Dificultad en comprensión de oraciones', 'Lenguaje', 'BLOC'),
(59, 'H059', 'Dificultad en producción de oraciones', 'Lenguaje', 'BLOC'),
(60, 'H060', 'Recepción auditiva (percentil)', 'Procesamiento', 'ITPA'),
(61, 'H061', 'Recepción visual (percentil)', 'Procesamiento', 'ITPA'),
(62, 'H062', 'Asociación auditiva (percentil)', 'Procesamiento', 'ITPA'),
(63, 'H063', 'Asociación visual (percentil)', 'Procesamiento', 'ITPA'),
(64, 'H064', 'Expresión verbal (percentil)', 'Procesamiento', 'ITPA'),
(65, 'H065', 'Expresión motora (percentil)', 'Procesamiento', 'ITPA'),
(66, 'H066', 'Memoria secuencial auditiva (percentil)', 'Procesamiento', 'ITPA'),
(67, 'H067', 'Memoria secuencial visual (percentil)', 'Procesamiento', 'ITPA'),
(68, 'H068', 'Discrepancia entre canales auditivo y visual', 'Procesamiento', 'ITPA'),
(69, 'H069', 'Groping (búsqueda articulatoria)', 'Motor', 'TSA'),
(70, 'H070', 'Frecuencia de repeticiones de sílabas', 'Fluidez', 'SSI-4'),
(71, 'H071', 'Frecuencia de prolongaciones', 'Fluidez', 'SSI-4'),
(72, 'H072', 'Frecuencia de bloqueos', 'Fluidez', 'SSI-4'),
(73, 'H073', 'Duración de las disfluencias', 'Fluidez', 'SSI-4'),
(74, 'H074', 'Severidad total de tartamudez', 'Fluidez', 'SSI-4'),
(75, 'H075', 'Evitación de palabras', 'Fluidez', 'SSI-4'),
(76, 'H076', 'Ansiedad al hablar', 'Fluidez', 'SSI-4'),
(77, 'H077', 'Fluidez semántica (número de palabras)', 'Lenguaje', 'Fluidez Verbal'),
(78, 'H078', 'Fluidez fonológica (número de palabras)', 'Lenguaje', 'Fluidez Verbal'),
(79, 'H079', 'Fluidez semántica < percentil 10', 'Lenguaje', 'Fluidez Verbal'),
(80, 'H080', 'Fluidez fonológica < percentil 10', 'Lenguaje', 'Fluidez Verbal'),
(81, 'H081', 'Dificultad en lectura de palabras', 'Lectura', 'PROLEC-R'),
(82, 'H082', 'Dificultad en lectura de pseudopalabras', 'Lectura', 'PROLEC-R'),
(83, 'H083', 'Confusión de letras similares (b/d, p/q)', 'Lectura', 'PROLEC-R'),
(84, 'H084', 'Dificultad en comprensión lectora', 'Lectura', 'PROLEC-R'),
(85, 'H085', 'Velocidad lectora (palabras por minuto)', 'Lectura', 'PROLEC-R'),
(86, 'H086', 'Velocidad lectora < esperado para edad', 'Lectura', 'PROLEC-R'),
(87, 'H087', 'Dificultad en escritura al dictado', 'Escritura', 'PROLEC-R'),
(88, 'H088', 'Omisiones en escritura', 'Escritura', 'PROLEC-R'),
(89, 'H089', 'Inversiones en escritura', 'Escritura', 'PROLEC-R'),
(90, 'H090', 'Dificultad en copia de textos', 'Escritura', 'PROLEC-R'),
(91, 'H091', 'Ronquera', 'Voz', 'VOZ'),
(92, 'H092', 'Afonía', 'Voz', 'VOZ'),
(93, 'H093', 'Tensión vocal', 'Voz', 'VOZ'),
(94, 'H094', 'Fatiga vocal', 'Voz', 'VOZ'),
(95, 'H095', 'Nódulos vocales', 'Voz', 'VOZ'),
(96, 'H096', 'Disfonía funcional', 'Voz', 'VOZ'),
(97, 'H097', 'Disfonía orgánica', 'Voz', 'VOZ'),
(98, 'H098', 'Dificultad en filtrado auditivo', 'Procesamiento', 'SCAN-3'),
(99, 'H099', 'Dificultad en escucha dicótica', 'Procesamiento', 'SCAN-3'),
(100, 'H100', 'Dificultad en discriminación auditiva', 'Procesamiento', 'SCAN-3'),
(101, 'H101', 'Trastorno de Procesamiento Auditivo Central (TPAC)', 'Procesamiento', 'SCAN-3'),
(102, 'H102', 'Edad (meses)', 'Demografico', 'Registro'),
(103, 'H103', 'Rango 36-47 meses', 'Demografico', 'Registro'),
(104, 'H104', 'Rango 48-59 meses', 'Demografico', 'Registro'),
(105, 'H105', 'Rango 60-71 meses', 'Demografico', 'Registro'),
(106, 'H106', 'Rango 72-83 meses', 'Demografico', 'Registro'),
(107, 'H107', 'Rango 84-95 meses', 'Demografico', 'Registro'),
(108, 'H108', 'Rango 96-107 meses', 'Demografico', 'Registro'),
(109, 'H109', 'Rango 108-120 meses', 'Demografico', 'Registro'),
(110, 'H110', 'Sexo masculino', 'Demografico', 'Registro'),
(111, 'H111', 'Sexo femenino', 'Demografico', 'Registro'),
(112, 'H112', 'Contexto cultural paceño', 'Demografico', 'Registro'),
(113, 'H113', 'Dificultad o ausencia de vibración lingual (/r/)', 'Anamnesis', 'PEFF/TAR'),
(114, 'H114', 'Dificultad para entender órdenes con ruido de fondo', 'Anamnesis', 'SCAN-3'),
(115, 'H115', 'Dificultades o errores en la lectura fluida', 'Anamnesis', 'PROLEC-R'),
(116, 'H116', 'Antecedentes familiares de trastornos del habla', 'Anamnesis', 'Registro'),
(117, 'H117', 'Infecciones de oído o otitis frecuentes', 'Anamnesis', 'Médico'),
(118, 'H118', 'Complicaciones durante el parto o prenatales', 'Anamnesis', 'Médico'),
(119, 'H119', 'Exposición a bilingüismo en el entorno familiar', 'Anamnesis', 'Contexto'),
(120, 'H120', 'Uso prolongado de chupón o biberón', 'Anamnesis', 'Hábitos'),
(121, 'H121', 'Dificultad en la masticación de alimentos sólidos', 'Anamnesis', 'Motor-Oral'),
(122, 'H122', 'Respiración predominantemente bucal', 'Anamnesis', 'Fisiológico'),
(123, 'H123', 'Periodo de muda de dientes frontales (incisivos)', 'Anamnesis', 'Fisiológico'),
(124, 'H124', 'Evitación de contacto social por problemas de habla', 'Anamnesis', 'Psicosocial'),
(125, 'H125', 'Presencia de errores constantes en la escritura', 'Anamnesis', 'Escolar'),
(126, 'H126', 'Conciencia del propio error al hablar o leer', 'Anamnesis', 'Metalingüístico');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `datos_padres`
--

CREATE TABLE `datos_padres` (
  `id_padre` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `nombre_completo` varchar(150) NOT NULL,
  `numero_celular` varchar(20) NOT NULL,
  `ciudad` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

--
-- Volcado de datos para la tabla `datos_padres`
--

INSERT INTO `datos_padres` (`id_padre`, `id_usuario`, `nombre_completo`, `numero_celular`, `ciudad`) VALUES
(1, 1, 'Carlos Quispe Mamani', '77200000', 'La Paz'),
(2, 3, 'Padre de Prueba', '70000000', 'La Paz'),
(5, 6, 'Yhorel ', '00000000', 'La Paz'),
(6, 7, 'PRUEBA PADRE', '67131731', 'La Paz');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `evaluaciones`
--

CREATE TABLE `evaluaciones` (
  `id_evaluacion` int(11) NOT NULL,
  `id_nino` int(11) NOT NULL,
  `fecha_evaluacion` timestamp NULL DEFAULT current_timestamp(),
  `edad_al_momento_evaluacion` int(11) DEFAULT NULL,
  `id_diagnostico_final` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

--
-- Volcado de datos para la tabla `evaluaciones`
--

INSERT INTO `evaluaciones` (`id_evaluacion`, `id_nino`, `fecha_evaluacion`, `edad_al_momento_evaluacion`, `id_diagnostico_final`) VALUES
(1, 1, '2026-04-14 20:24:23', 6, NULL),
(2, 2, '2026-04-16 03:06:42', 8, NULL),
(3, 3, '2026-04-16 05:40:56', 7, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `evidencia_sesion`
--

CREATE TABLE `evidencia_sesion` (
  `id_evidencia` int(11) NOT NULL,
  `id_evaluacion` int(11) NOT NULL,
  `id_hecho` int(11) NOT NULL,
  `valor_fuzzy` decimal(3,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

--
-- Volcado de datos para la tabla `evidencia_sesion`
--

INSERT INTO `evidencia_sesion` (`id_evidencia`, `id_evaluacion`, `id_hecho`, `valor_fuzzy`) VALUES
(1, 1, 20, 0.85),
(2, 1, 21, 0.75);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `perfiles_ninos`
--

CREATE TABLE `perfiles_ninos` (
  `id_nino` int(11) NOT NULL,
  `id_padre` int(11) NOT NULL,
  `nombre_nino` varchar(100) NOT NULL,
  `fecha_nacimiento` date NOT NULL,
  `genero` enum('Masculino','Femenino') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

--
-- Volcado de datos para la tabla `perfiles_ninos`
--

INSERT INTO `perfiles_ninos` (`id_nino`, `id_padre`, `nombre_nino`, `fecha_nacimiento`, `genero`) VALUES
(1, 1, 'Carlitos Quispe', '2020-03-12', 'Masculino'),
(2, 5, 'Canilo', '2017-07-15', 'Masculino'),
(3, 6, 'PRUEBANIÑO', '2018-05-06', 'Masculino');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `reglas_diagnostico`
--

CREATE TABLE `reglas_diagnostico` (
  `id_regla` int(11) NOT NULL,
  `id_hecho` int(11) NOT NULL,
  `id_diagnostico` int(11) NOT NULL,
  `peso_certeza` decimal(3,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

--
-- Volcado de datos para la tabla `reglas_diagnostico`
--

INSERT INTO `reglas_diagnostico` (`id_regla`, `id_hecho`, `id_diagnostico`, `peso_certeza`) VALUES
(1, 23, 1, 0.90),
(1, 25, 1, 0.85),
(1, 26, 1, 0.85),
(1, 69, 1, 0.95),
(2, 23, 2, 0.85),
(2, 69, 2, 0.90),
(3, 20, 3, 0.80),
(3, 21, 3, 0.80),
(4, 1, 4, 0.70),
(4, 2, 4, 0.70),
(4, 3, 4, 0.70),
(4, 4, 4, 0.70),
(4, 5, 4, 0.70),
(4, 6, 4, 0.70),
(4, 7, 4, 0.70),
(4, 8, 4, 0.70),
(4, 9, 4, 0.70),
(4, 10, 4, 0.70),
(4, 11, 4, 0.70),
(4, 12, 4, 0.70),
(4, 13, 4, 0.70),
(4, 14, 4, 0.70),
(4, 15, 4, 0.70),
(4, 16, 4, 0.70),
(4, 17, 4, 0.70),
(4, 18, 4, 0.70),
(4, 19, 4, 0.70),
(5, 1, 5, 0.85),
(6, 3, 6, 0.85),
(7, 4, 7, 0.85),
(8, 22, 8, 0.75),
(9, 20, 9, 0.80),
(9, 21, 9, 0.80),
(9, 22, 9, 0.80),
(10, 24, 10, 0.95),
(11, 36, 11, 0.20),
(11, 39, 11, 0.80),
(12, 36, 12, 0.85),
(12, 39, 12, 0.85),
(13, 41, 13, 0.75),
(14, 43, 14, 0.80),
(14, 45, 14, 0.20),
(15, 43, 15, 0.20),
(15, 45, 15, 0.80),
(16, 43, 16, 0.85),
(16, 45, 16, 0.85),
(17, 51, 17, 0.85),
(17, 55, 17, 0.85),
(18, 60, 18, 0.80),
(18, 61, 18, 0.20),
(19, 66, 19, 0.80),
(19, 67, 19, 0.20),
(20, 68, 20, 0.75),
(21, 70, 21, 0.85),
(21, 71, 21, 0.85),
(21, 72, 21, 0.85),
(22, 74, 22, 0.80),
(23, 74, 23, 0.90),
(23, 75, 23, 0.85),
(23, 76, 23, 0.85),
(24, 70, 24, 0.70),
(25, 79, 25, 0.80),
(25, 80, 25, 0.20),
(26, 79, 26, 0.20),
(26, 80, 26, 0.80),
(27, 81, 27, 0.85),
(27, 82, 27, 0.90),
(27, 83, 27, 0.80),
(28, 81, 28, 0.85),
(28, 83, 28, 0.80),
(29, 84, 29, 0.80),
(30, 87, 30, 0.85),
(30, 88, 30, 0.80),
(30, 89, 30, 0.80),
(31, 91, 31, 0.80),
(31, 93, 31, 0.80),
(32, 95, 32, 0.90),
(33, 98, 33, 0.85),
(33, 99, 33, 0.85),
(33, 100, 33, 0.85),
(34, 23, 34, 0.85),
(34, 39, 34, 0.80),
(35, 20, 35, 0.80),
(35, 39, 35, 0.80),
(36, 20, 36, 0.80),
(36, 70, 36, 0.80),
(37, 20, 37, 0.80),
(37, 81, 37, 0.85),
(38, 23, 38, 0.85),
(38, 98, 38, 0.80),
(39, 39, 39, 0.80),
(39, 45, 39, 0.80),
(40, 70, 40, 0.80),
(40, 91, 40, 0.80);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `resultados_reporte`
--

CREATE TABLE `resultados_reporte` (
  `id_reporte` int(11) NOT NULL,
  `id_evaluacion` int(11) NOT NULL,
  `porcentaje_certeza` decimal(5,2) NOT NULL,
  `recomendacion_especifica` text DEFAULT NULL,
  `enviado_al_celular` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

--
-- Volcado de datos para la tabla `resultados_reporte`
--

INSERT INTO `resultados_reporte` (`id_reporte`, `id_evaluacion`, `porcentaje_certeza`, `recomendacion_especifica`, `enviado_al_celular`) VALUES
(1, 1, 80.00, 'Se recomienda practicar ejercicios de repetición de sílabas con el fonema /r/ al menos 3 veces por semana.', 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `roles`
--

CREATE TABLE `roles` (
  `id_rol` int(11) NOT NULL,
  `nombre_rol` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

--
-- Volcado de datos para la tabla `roles`
--

INSERT INTO `roles` (`id_rol`, `nombre_rol`) VALUES
(1, 'ADMIN'),
(4, 'INVITADO'),
(3, 'NIÑO'),
(2, 'PADRE');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id_usuario` int(11) NOT NULL,
  `correo` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `id_rol` int(11) NOT NULL,
  `fecha_registro` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id_usuario`, `correo`, `password_hash`, `id_rol`, `fecha_registro`) VALUES
(1, 'carlosq@gmail.com', 'admin123', 2, '2026-04-14 16:23:46'),
(2, 'sefonotes26@gmail.com', '0000', 1, '2026-04-14 16:24:06'),
(3, 'Padmin@test.com', 'hash_seguro_123', 2, '2026-04-14 16:24:47'),
(6, 'yhared@gmail.com', 'scrypt:32768:8:1$9g2s3U0Od6r3Zq2b$52bafd9beaebd7e95e608783be59f6e7543bd097625e59b19a846a1063bcf053f14032856c8535bf2c2b899adcfcc09ad2539a9cc98010b85540c6fbf61fe59e', 2, '2026-04-15 23:06:42'),
(7, 'pacho@gmail.com', 'scrypt:32768:8:1$Mj1ezMh40upd4DPF$bcb3de00a305111b666d6745962d2d7d33a2dd3f7d33fb5d2f1112d9ce3f0eb1f5a67ffeba4d718f0147765e636aff0cada7a3dcb5f41ec4d108381db427d79f', 2, '2026-04-16 01:40:56');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `anamnesis`
--
ALTER TABLE `anamnesis`
  ADD PRIMARY KEY (`id_anamnesis`),
  ADD KEY `fk_nino_anamnesis` (`id_nino`);

--
-- Indices de la tabla `catalogo_diagnosticos`
--
ALTER TABLE `catalogo_diagnosticos`
  ADD PRIMARY KEY (`id_diagnostico`);

--
-- Indices de la tabla `catalogo_hechos`
--
ALTER TABLE `catalogo_hechos`
  ADD PRIMARY KEY (`id_hecho`),
  ADD UNIQUE KEY `codigo_h` (`codigo_h`);

--
-- Indices de la tabla `datos_padres`
--
ALTER TABLE `datos_padres`
  ADD PRIMARY KEY (`id_padre`),
  ADD KEY `id_usuario` (`id_usuario`);

--
-- Indices de la tabla `evaluaciones`
--
ALTER TABLE `evaluaciones`
  ADD PRIMARY KEY (`id_evaluacion`),
  ADD KEY `id_nino` (`id_nino`),
  ADD KEY `id_diagnostico_final` (`id_diagnostico_final`);

--
-- Indices de la tabla `evidencia_sesion`
--
ALTER TABLE `evidencia_sesion`
  ADD PRIMARY KEY (`id_evidencia`),
  ADD KEY `id_evaluacion` (`id_evaluacion`),
  ADD KEY `id_hecho` (`id_hecho`);

--
-- Indices de la tabla `perfiles_ninos`
--
ALTER TABLE `perfiles_ninos`
  ADD PRIMARY KEY (`id_nino`),
  ADD KEY `id_padre` (`id_padre`);

--
-- Indices de la tabla `reglas_diagnostico`
--
ALTER TABLE `reglas_diagnostico`
  ADD PRIMARY KEY (`id_regla`,`id_hecho`),
  ADD KEY `id_hecho` (`id_hecho`),
  ADD KEY `id_diagnostico` (`id_diagnostico`);

--
-- Indices de la tabla `resultados_reporte`
--
ALTER TABLE `resultados_reporte`
  ADD PRIMARY KEY (`id_reporte`),
  ADD KEY `id_evaluacion` (`id_evaluacion`);

--
-- Indices de la tabla `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id_rol`),
  ADD UNIQUE KEY `nombre_rol` (`nombre_rol`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id_usuario`),
  ADD UNIQUE KEY `correo` (`correo`),
  ADD KEY `id_rol` (`id_rol`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `anamnesis`
--
ALTER TABLE `anamnesis`
  MODIFY `id_anamnesis` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `datos_padres`
--
ALTER TABLE `datos_padres`
  MODIFY `id_padre` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `evaluaciones`
--
ALTER TABLE `evaluaciones`
  MODIFY `id_evaluacion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `evidencia_sesion`
--
ALTER TABLE `evidencia_sesion`
  MODIFY `id_evidencia` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `perfiles_ninos`
--
ALTER TABLE `perfiles_ninos`
  MODIFY `id_nino` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `resultados_reporte`
--
ALTER TABLE `resultados_reporte`
  MODIFY `id_reporte` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `anamnesis`
--
ALTER TABLE `anamnesis`
  ADD CONSTRAINT `fk_nino_anamnesis` FOREIGN KEY (`id_nino`) REFERENCES `perfiles_ninos` (`id_nino`) ON DELETE CASCADE;

--
-- Filtros para la tabla `datos_padres`
--
ALTER TABLE `datos_padres`
  ADD CONSTRAINT `1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE;

--
-- Filtros para la tabla `evaluaciones`
--
ALTER TABLE `evaluaciones`
  ADD CONSTRAINT `1` FOREIGN KEY (`id_nino`) REFERENCES `perfiles_ninos` (`id_nino`) ON DELETE CASCADE,
  ADD CONSTRAINT `2` FOREIGN KEY (`id_diagnostico_final`) REFERENCES `catalogo_diagnosticos` (`id_diagnostico`);

--
-- Filtros para la tabla `evidencia_sesion`
--
ALTER TABLE `evidencia_sesion`
  ADD CONSTRAINT `1` FOREIGN KEY (`id_evaluacion`) REFERENCES `evaluaciones` (`id_evaluacion`) ON DELETE CASCADE,
  ADD CONSTRAINT `2` FOREIGN KEY (`id_hecho`) REFERENCES `catalogo_hechos` (`id_hecho`);

--
-- Filtros para la tabla `perfiles_ninos`
--
ALTER TABLE `perfiles_ninos`
  ADD CONSTRAINT `1` FOREIGN KEY (`id_padre`) REFERENCES `datos_padres` (`id_padre`) ON DELETE CASCADE;

--
-- Filtros para la tabla `reglas_diagnostico`
--
ALTER TABLE `reglas_diagnostico`
  ADD CONSTRAINT `1` FOREIGN KEY (`id_hecho`) REFERENCES `catalogo_hechos` (`id_hecho`),
  ADD CONSTRAINT `2` FOREIGN KEY (`id_diagnostico`) REFERENCES `catalogo_diagnosticos` (`id_diagnostico`);

--
-- Filtros para la tabla `resultados_reporte`
--
ALTER TABLE `resultados_reporte`
  ADD CONSTRAINT `1` FOREIGN KEY (`id_evaluacion`) REFERENCES `evaluaciones` (`id_evaluacion`) ON DELETE CASCADE;

--
-- Filtros para la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD CONSTRAINT `1` FOREIGN KEY (`id_rol`) REFERENCES `roles` (`id_rol`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
