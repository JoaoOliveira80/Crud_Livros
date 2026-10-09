package com.entrelinhas.dto;

import java.util.Map;

public record EstatisticasResponse(
        long total, long lidos, long lendo, long queroLer, long favoritos,
        long paginasLidas, long paginasCatalogadas, double avaliacaoMedia,
        Map<String, Long> porGenero) {}
