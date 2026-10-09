package com.entrelinhas.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record ProgressoRequest(@NotNull(message = "Página atual é obrigatória")
                               @Min(value = 0, message = "A página atual não pode ser negativa") Integer paginaAtual) {}
